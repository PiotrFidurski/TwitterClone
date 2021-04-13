import User from "../entity/User";
import { IResolvers } from "graphql-tools";
import { OwnContext } from "types";
import Conversation from "../entity/Conversation/index";
import Message from "../entity/Message";
import { withFilter } from "graphql-subscriptions";
import { redisPubSub } from "../index";
import { Types } from "mongoose";
import LastSeenMessage from "../entity/Conversation/LastSeenMessage";
import LeftConversationAt from "../entity/Conversation/LeftConversationAt";

export default {
  Query: {
    userInbox: async (_, args, { authenticatedUser }: OwnContext) => {
      try {
        const user = await User.findById(authenticatedUser!._id);
        const unreadMessage = await LastSeenMessage.findOne({
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
          {
            $lookup: {
              from: "messages",
              let: {
                conversationId: "$conversationId",
              },
              pipeline: [
                {
                  $match: {
                    $expr: {
                      $and: [{ $eq: ["$conversationId", "$$conversationId"] }],
                    },
                  },
                },
                { $sort: { _id: -1 } },
                { $limit: 3 },
              ],
              as: "messages_conversation",
            },
          },
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
          lastSeenMessageId: unreadMessage
            ? unreadMessage!.lastSeenMessageId
            : "",
          userId: unreadMessage ? unreadMessage!.userId : "",
        };
      } catch (error) {
        throw new Error(error);
      }
    },
    conversationMessages: async (
      _,
      { cursorId, limit, conversationId, leftAtMessageId },
      { authenticatedUser }: OwnContext
    ) => {
      try {
        const conversation = await Conversation.aggregate([
          { $match: { conversationId: { $eq: conversationId } } },
          {
            $lookup: {
              from: "messages",
              let: {
                conversationId: "$conversationId",
                weSendIt: authenticatedUser!._id,
              },
              pipeline: [
                {
                  $match: {
                    $expr: {
                      $and: [{ $eq: ["$conversationId", "$$conversationId"] }],
                    },
                  },
                },
                { $sort: { _id: -1 } },
                { $limit: 3 },
              ],
              as: "messages_conversation",
            },
          },
        ]);
        const leftConvoAt = await LeftConversationAt.findOne({
          userId: authenticatedUser!._id,
          conversationId: conversationId,
        });
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

        let hasNextPage = false;
        if (messages[messages.length - 1] !== undefined) {
          const result = await Message.findOne({
            _id: {
              $lt: messages[0]._id,
            },
          }).sort({ _id: -1 });
          if (result) {
            hasNextPage = true;
          }
        }

        return {
          conversation: conversation[0],
          messages: messages.reverse(),
          hasNextPage: hasNextPage,
        };
      } catch (error) {
        throw new Error(error);
      }
    },
    leftAt: async (_, { userId, conversationId }) => {
      const leftAt = await LeftConversationAt.findOne({
        userId: userId,
        conversationId: conversationId,
      });

      return leftAt;
    },
  },
  Mutation: {
    updateLastSeenMessage: async (
      _,
      { messageId },
      { authenticatedUser }: OwnContext
    ) => {
      const updateConv = await LastSeenMessage.findOneAndUpdate(
        {
          userId: { $eq: authenticatedUser!._id },
        },
        {
          $set: {
            lastSeenMessageId: messageId,
          },
        },
        { new: true }
      );

      return updateConv;
    },
    readConversation: async (
      _,
      { conversationId, messageId },
      { authenticatedUser }: OwnContext
    ) => {
      const updatedConversation = await Conversation.findOneAndUpdate(
        {
          conversationId: { $eq: conversationId },
          "participants.userId": { $eq: authenticatedUser!._id },
        },
        {
          $set: {
            "participants.$.lastReadMessageId": messageId,
          },
        },
        { new: true }
      );

      return updatedConversation;
    },
    messageUser: async (_, { userId }, { authenticatedUser }: OwnContext) => {
      try {
        const authUser = await User.findById(authenticatedUser._id);
        const userToBeMessaged = await User.findById(userId);
        const unreadMessage = await LastSeenMessage.findOne({
          userId: { $eq: authenticatedUser!._id },
        });
        const unreadMessageForUser = await LastSeenMessage.findOne({
          userId: { $eq: userId },
        });
        if (!unreadMessageForUser) {
          await LastSeenMessage.create({
            userId: userId!,
            lastSeenMessageId: "",
          });
        }
        if (!unreadMessage) {
          await LastSeenMessage.create({
            userId: authenticatedUser!._id,
            lastSeenMessageId: "",
          });
        }
        const areInConversation = await Conversation.find({
          $or: [
            {
              conversationId: {
                $eq: `${authUser!.id}-${userToBeMessaged!.id}`,
              },
            },
            {
              conversationId: {
                $eq: `${userToBeMessaged!.id}-${authUser!.id}`,
              },
            },
          ],
        });

        if (areInConversation.length) {
          const conversationAggregation = await Conversation.aggregate([
            { $match: { _id: areInConversation[0]._id } },
            {
              $lookup: {
                from: "messages",
                let: {
                  conversationId: "$conversationId",
                },
                pipeline: [
                  {
                    $match: {
                      $expr: {
                        $and: [
                          { $eq: ["$conversationId", "$$conversationId"] },
                        ],
                      },
                    },
                  },
                  { $sort: { _id: -1 } },
                  { $limit: 3 },
                ],
                as: "messages_conversation",
              },
            },
          ]);
          return conversationAggregation[0];
        } else {
          const conversation = await Conversation.create({
            participants: [
              {
                userId: authUser!.id,
                lastReadMessageId: "",
              },
              {
                userId: userToBeMessaged!.id!,
                lastReadMessageId: "",
              },
            ],
            type: "ONE_ON_ONE",
            lastReadMessageId: "",
            mostRecentEntryId: "",
            oldestEntryId: "",
            conversationId: `${authUser!.id}-${userToBeMessaged!.id}`,
          });

          const conversationAggregation = await Conversation.aggregate([
            {
              $match: {
                conversationId: conversation!.conversationId,
              },
            },
            {
              $lookup: {
                from: "messages",
                let: {
                  conversationId: "$conversationId",
                },
                pipeline: [
                  {
                    $match: {
                      $expr: {
                        $and: [
                          { $eq: ["$conversationId", "$$conversationId"] },
                        ],
                      },
                    },
                  },
                  { $sort: { _id: -1 } },
                  { $limit: 3 },
                ],
                as: "messages_conversation",
              },
            },
            { $sort: { createdAt: -1 } },
            { $limit: 10 },
          ]);

          return conversationAggregation[0];
        }
      } catch (error) {
        console.log(error);
        throw new Error(error);
      }
    },
    sendMessage: async (
      _,
      { text, conversationId, senderId, receiverId },
      { authenticatedUser }: OwnContext
    ) => {
      try {
        const newMessage = await Message.create({
          conversationId,
          messagedata: { senderId, text, receiverId },
        });
        const receiver = await User.findById(senderId);
        await LastSeenMessage.findOneAndUpdate(
          {
            userId: { $eq: authenticatedUser!._id },
          },
          { $set: { lastSeenMessageId: newMessage.id } },
          { new: true }
        );

        if (newMessage) {
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
            {
              $lookup: {
                from: "messages",
                let: {
                  conversationId: "$conversationId",
                },
                pipeline: [
                  {
                    $match: {
                      $expr: {
                        $and: [
                          { $eq: ["$conversationId", "$$conversationId"] },
                        ],
                      },
                    },
                  },
                  { $sort: { _id: -1 } },
                  { $limit: 3 },
                ],
                as: "messages_conversation",
              },
            },
            { $sort: { createdAt: -1 } },
            { $limit: 10 },
          ]);

          redisPubSub.publish("conversation_updated", {
            conversationUpdated: {
              conversation: {
                id: updatedConversation!.id,
                conversationId: conversationAggregation[0]!.conversationId,
                lastReadMessageId: conversationAggregation[0]!
                  .lastReadMessageId,
                mostRecentEntryId: conversationAggregation[0]!
                  .mostRecentEntryId,
                oldestEntryId: conversationAggregation[0]!.oldestEntryId,
                participants: conversationAggregation[0]!.participants,
                messages_conversation: conversationAggregation[0]!
                  .messages_conversation,

                type: conversationAggregation[0]!.type,
                acceptedInvitation: conversationAggregation[0]!
                  .acceptedInvitation,
              },
              message: {
                id: newMessage._id,
                conversationId: newMessage.conversationId,
                messagedata: newMessage.messagedata,
              },
              receiver: {
                id: receiver!.id,
                avatar: receiver!.avatar,
                username: receiver!.username,
              },
            },
          });
          return {
            message: newMessage,
            conversation: conversationAggregation[0],
          };
        }
      } catch (error) {
        throw new Error(error);
      }
    },
    leaveConversation: async (
      _,
      { conversationId },
      { authenticatedUser }: OwnContext
    ) => {
      try {
        const user = await User.findById(authenticatedUser!._id);
        const leave = await LeftConversationAt.findOne({
          userId: authenticatedUser!._id,
          conversationId: conversationId,
        });

        const aboutToLeave = await Conversation.findOne({
          conversationId: conversationId,
        });
        if (leave) {
          await LeftConversationAt.findOneAndUpdate(
            { _id: { $eq: leave!._id } },
            {
              $set: {
                leftAtMessageId: aboutToLeave!.participants!.filter(
                  (user) => user.userId === authenticatedUser!._id
                )[0].lastReadMessageId,
              },
            },
            { new: true }
          );
        } else {
          await LeftConversationAt.create({
            userId: authenticatedUser!._id,
            leftAtMessageId: aboutToLeave!.participants!.filter(
              (user) => user.userId === authenticatedUser!._id
            )[0].lastReadMessageId,
            conversationId: conversationId,
          });
        }
        const conversation = await Conversation.findOneAndUpdate(
          {
            conversationId: conversationId,
            participants: { $elemMatch: { userId: user!.id! } },
          },
          {
            $set: {
              "participants.$.lastReadMessageId": "",
            },
          },
          { new: true }
        );
        return conversation;
      } catch (error) {
        throw new Error(error);
      }
    },
  },
  Subscription: {
    conversationUpdated: {
      subscribe: withFilter(
        () => redisPubSub.asyncIterator("conversation_updated"),
        (payload, variables) => {
          return (
            payload.conversationUpdated.message.messagedata.receiverId ===
            variables.userId
          );
        }
      ),
    },
  },
} as IResolvers;
