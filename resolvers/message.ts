import { RedisPubSub } from "graphql-redis-subscriptions";
import { withFilter } from "graphql-subscriptions";
import { IResolvers } from "graphql-tools";
import Redis from "ioredis";
import { Types } from "mongoose";
import { OwnContext } from "types";
import Conversation from "../entity/Conversation/index";
import LastSeenMessage from "../entity/Conversation/LastSeenMessage";
import Message from "../entity/Message";
import User from "../entity/User";
import {
  checkForValidObjectIds,
  conversationPipeline,
  resolve,
} from "../utilities/resolverUtils";

const subscriber = new Redis({
  host: `${process.env.REDIS_HOST}`,
  port: 18964,
  password: process.env.REDIS_PASSWORD,
  username: process.env.REDIS_USERNAME,
  retryStrategy: (options: any) => Math.max(options.attempt * 100, 3000),
});
const publisher = new Redis({
  host: `${process.env.REDIS_HOST}`,
  port: 18964,
  password: process.env.REDIS_PASSWORD,
  username: process.env.REDIS_USERNAME,
  retryStrategy: (options: any) => Math.max(options.attempt * 100, 3000),
});

let pubSub: RedisPubSub;

pubSub =
  process.env.NODE_ENV === "production"
    ? new RedisPubSub({
        subscriber,
        publisher,
      })
    : new RedisPubSub({
        connection: {
          port: 6379,
          retryStrategy: (times) => {
            return Math.min(times * 50, 2000);
          },
        },
      });

export default {
  Query: {
    userInbox: async (_, args, { authenticatedUser }: OwnContext) => {
      try {
        const user = await User.findById(authenticatedUser!._id);
        const lastSeenMessage = await LastSeenMessage.findOne({
          userId: { $eq: authenticatedUser!._id },
        });
        const conversations = await Conversation.aggregate([
          {
            $match: {
              participants: {
                $elemMatch: {
                  userId: { $eq: user!.id! },
                  lastReadMessageId: { $ne: "" },
                },
              },
            },
          },
          ...conversationPipeline,
          { $sort: { createdAt: -1 } },
        ]);

        let userIds: Array<string> = [];
        conversations.forEach((conversation) => {
          const ids = conversation.conversationId.split("-");
          userIds = [...userIds, ...ids];
        });
        const users = await User.find({ _id: { $in: userIds } });

        return {
          conversations: conversations,
          users: users,
          lastSeenMessageId: lastSeenMessage
            ? lastSeenMessage!.lastSeenMessageId
            : "",
          userId: lastSeenMessage ? lastSeenMessage!.userId : "",
        };
      } catch (error) {
        throw new Error(error);
      }
    },
    messages: async (
      _,
      { cursorId, limit, conversationId, leftAtMessageId }
    ) => {
      try {
        if (!limit || !conversationId)
          throw new Error(
            "argument of limit or conversationId was not provided."
          );
        const [firstHalfofConversationId, secondHalfofConversationId] =
          conversationId.split("-");

        checkForValidObjectIds(
          {
            cursorId,
            firstHalfofConversationId,
            secondHalfofConversationId,
          },
          "This conversation might not exist yet."
        );
        if (leftAtMessageId) checkForValidObjectIds({ leftAtMessageId });

        const conversation = await Conversation.aggregate([
          { $match: { conversationId: { $eq: conversationId } } },
          ...conversationPipeline,
        ]);
        if (!conversation.length)
          throw new Error("this conversation might not exist yet.");
        const messages = await Message.aggregate([
          {
            $match: {
              $expr: {
                $cond: {
                  if: { $ne: [cursorId, undefined] },
                  then: {
                    $and: [
                      { $eq: ["$conversationId", conversationId] },
                      {
                        $lt: ["$_id", Types.ObjectId(cursorId)],
                      },
                      {
                        $gt: [
                          "$_id",
                          leftAtMessageId
                            ? Types.ObjectId(leftAtMessageId)
                            : "",
                        ],
                      },
                    ],
                  },
                  else: {
                    $and: [
                      { $eq: ["$conversationId", conversationId] },
                      {
                        $gt: [
                          "$_id",
                          leftAtMessageId
                            ? Types.ObjectId(leftAtMessageId)
                            : "",
                        ],
                      },
                    ],
                  },
                },
              },
            },
          },
          { $sort: { _id: -1 } },
          { $limit: limit },
        ]);

        let hasPreviousPage = false;
        if (messages[messages.length - 1] !== undefined) {
          const result = await Message.findOne({
            _id: {
              $lt: Types.ObjectId(cursorId),
            },
          }).sort({ _id: -1 });
          if (result) {
            hasPreviousPage = true;
          }
        }

        return {
          conversation: conversation[0],
          edges: messages.length
            ? messages
                .map((message) => ({
                  node: message,
                  cursor: message._id,
                }))
                .reverse()
            : [],
          pageInfo: {
            hasPreviousPage: hasPreviousPage,
            hasNextPage: false,
            startCursor: messages.length ? messages[0]._id : "",
            endCursor:
              messages[messages.length - 1] !== undefined
                ? messages[messages.length - 1]._id
                : "",
          },
        };
      } catch (error) {
        return {
          message: error.message,
          conversationId,
          cursorId,
          leftAtMessageId,
          limit,
        };
      }
    },
  },
  Mutation: {
    sendMessage: async (
      _,
      { text, conversationId, senderId, receiverId },
      { authenticatedUser }: OwnContext
    ) => {
      try {
        const [firstHalfofConversationId, secondHalfofConversationId] =
          conversationId.split("-");

        checkForValidObjectIds({
          senderId,
          receiverId,
          firstHalfofConversationId,
          secondHalfofConversationId,
        });
        if (!text) throw new Error("argument of text was not provided");
        const newMessage = await Message.create({
          conversationId,
          messagedata: { senderId, text, receiverId },
        });

        const sender = await User.findById(senderId);

        await LastSeenMessage.findOneAndUpdate(
          {
            userId: { $eq: authenticatedUser!._id },
          },
          { $set: { lastSeenMessageId: newMessage.id } },
          { new: true }
        );

        const messages = await Message.find({
          conversationId: conversationId,
        });
        if (messages.length > 1) {
          await Conversation.findOneAndUpdate(
            {
              conversationId: { $eq: conversationId },
              "participants.userId": { $eq: receiverId },
            },
            {
              $set: {
                "participants.$.lastReadMessageId":
                  messages[messages.length - 2].id,
              },
            },
            { new: true }
          );
        } else {
          await Conversation.findOneAndUpdate(
            {
              conversationId: { $eq: conversationId },
              "participants.userId": { $eq: receiverId },
            },
            {
              $set: {
                "participants.$.lastReadMessageId": "standby",
              },
            },
            { new: true }
          );
        }

        const updatedConversation = await Conversation.findOneAndUpdate(
          {
            conversationId: { $eq: conversationId },
            "participants.userId": { $eq: senderId },
          },
          {
            $set: {
              "participants.$.lastReadMessageId": newMessage!.id!,
              mostRecentEntryId: newMessage.id,
              oldestEntryId: messages[0].id,
              lastReadMessageId: newMessage!.id!,
            },
          },
          { new: true }
        );

        const conversationAggregation = await Conversation.aggregate([
          {
            $match: {
              conversationId: conversationId,
            },
          },
          ...conversationPipeline,
        ]);

        pubSub.publish("conversation_updated", {
          conversationUpdated: {
            conversation: {
              id: updatedConversation!.id,
              conversationId: conversationAggregation[0]!.conversationId,
              lastReadMessageId: conversationAggregation[0]!.lastReadMessageId,
              mostRecentEntryId: conversationAggregation[0]!.mostRecentEntryId,
              oldestEntryId: conversationAggregation[0]!.oldestEntryId,
              participants: conversationAggregation[0]!.participants,
              messages_conversation:
                conversationAggregation[0]!.messages_conversation,

              type: conversationAggregation[0]!.type,
              acceptedInvitation:
                conversationAggregation[0]!.acceptedInvitation,
            },
            message: {
              id: newMessage._id,
              conversationId: newMessage.conversationId,
              messagedata: newMessage.messagedata,
            },
            sender: {
              id: sender!.id,
              avatar: sender!.avatar,
              username: sender!.username,
            },
          },
        });
        return {
          conversation: conversationAggregation[0],
          newmessage: { node: newMessage, cursor: newMessage.id },
        };
      } catch (error) {
        return {
          message: error.message,
          text,
          conversationId,
          senderId,
          receiverId,
        };
      }
    },
  },
  Subscription: {
    conversationUpdated: {
      subscribe: withFilter(
        () => pubSub.asyncIterator("conversation_updated"),
        (payload, variables) => {
          return (
            payload.conversationUpdated.message.messagedata.receiverId ===
            variables.userId
          );
        }
      ),
    },
  },
  Message: {
    id: (parent) => {
      return parent.id || parent._id;
    },
  },
  MessagesResult: {
    __resolveType(obj: any) {
      return resolve(obj, {
        success: "MessagesConnection",
        error: "MessagesInvalidInputError",
      });
    },
  },
  SendMessageResult: {
    __resolveType(obj: any) {
      return resolve(obj, {
        success: "SendMessageSuccess",
        error: "SendMessageInvalidInputError",
      });
    },
  },
} as IResolvers;
