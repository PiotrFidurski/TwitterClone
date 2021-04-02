import User from "../entity/User";
import { IResolvers } from "graphql-tools";
import { OwnContext } from "types";
import Conversation from "../entity/Conversation";
import Message from "../entity/Message";
import { withFilter } from "graphql-subscriptions";
import { redisPubSub } from "../index";
import { Types } from "mongoose";

export default {
  Query: {
    userInbox: async (_, args, { authenticatedUser }: OwnContext) => {
      // we are grabbing users inbox which consists of
      // all the conversations he's part of
      // and for each conversation we load last 3 messages of users
      // that arent us
      const user = await User.findById(authenticatedUser!._id);

      const conversationAggregation = await Conversation.aggregate([
        {
          $match: {
            "participants.userId": { $in: [user!.id] },
          },
        },
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
        {
          $lookup: {
            from: "users",
            let: {
              // userId: { $filter: ["$participants", 1] },
              userId: {
                $filter: {
                  input: "$participants",
                  as: "user",
                  cond: {
                    $ne: [
                      "$$user.userId",
                      { $toString: authenticatedUser!._id },
                    ],
                  },
                },
              },
            },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $and: [
                      {
                        $eq: [
                          { $arrayElemAt: ["$$userId.userId", 0] },
                          { $toString: "$_id" },
                        ],
                      },
                    ],
                  },
                },
              },
            ],
            as: "user",
          },
        },
        { $unwind: "$user" },
        { $sort: { createdAt: -1 } },
      ]);

      // const user = await User.find({})
      // const message = await Message.findById(cursorId);
      // const hasNextPage = await Message.find({
      //   conversationId: { $eq: message!.conversationId },
      //   _id: { $lt: Types.ObjectId(cursorId) },
      // })
      //   .sort({ _id: -1 })
      //   .limit(1);
      console.log(conversationAggregation);
      return conversationAggregation;
    },
    conversationMessages: async (
      _,
      { cursorId, limit, conversationId },
      { authenticatedUser }: OwnContext
    ) => {
      // grab conversation where messages are from
      // grab all messages of this conversation (paginated)
      // return {conversation: Conversation}, messages: Array<Messages>}

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
                    ],
                  },
                  else: { $eq: ["$conversationId", conversationId] },
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
            console.log(result);
            hasNextPage = true;
          } else {
            hasNextPage = false;
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
    userConversations: async (_, args, { authenticatedUser }: OwnContext) => {
      const user = await User.findById(authenticatedUser!._id);

      const conversations = await Conversation.find({
        members: { $in: [user!] },
      }).populate("members");

      return conversations;
    },
    getConversation: async (
      _,
      { conversationId },
      { authenticatedUser }: OwnContext
    ) => {
      const conversation = await Conversation.find({
        conversationId: conversationId,
      }).populate("members");

      return conversation[0];
    },
  },
  Mutation: {
    updateLastSeenMessage: async (
      _,
      { messageId, conversationId },
      { authenticatedUser }: OwnContext
    ) => {
      const conversation = await Conversation.findOneAndUpdate(
        {
          conversationId: conversationId,
          "participants.userId": { $eq: authenticatedUser!._id },
        },
        {
          $set: {
            "participants.$.lastSeenMessageId": messageId,
          },
        },
        { new: true }
      );

      return conversation;
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
        const hasBeenMessaged = await Conversation.find({
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

        if (hasBeenMessaged.length) {
          throw new Error("you already messaged this user.");
        } else {
          const conversation = await Conversation.create({
            members: [authUser!, userToBeMessaged],
            participants: [
              { userId: authUser!.id, lastSeenMessageId: "" },
              { userId: userToBeMessaged!.id!, lastSeenMessageId: "" },
            ],
            type: "ONE_ON_ONE",
            lastReadMessageId: "",
            mostRecentEntryId: "",
            oldestEntryId: "",
            acceptedInvitation: [authUser!.id],
            conversationId: `${authUser!.id}-${userToBeMessaged!.id}`,
          });

          const messages = await Message.find({
            conversationId: { $eq: conversation!.conversationId },
          });
          let updatedConversation = null;
          if (messages.length) {
            updatedConversation = await Conversation.findOneAndUpdate(
              { conversationId: conversation.conversationId },
              {
                $set: {
                  oldestEntryId: messages[0].id,
                  mostRecentEntryId: messages[messages.length - 1].id,
                  lastReadMessageId: messages[messages.length - 1].id,
                },
              },
              { new: true }
            );
          }
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
          console.log(conversationAggregation, conversation);
          redisPubSub.publish("conversation_updated", {
            conversationUpdated: {
              conversation: {
                id: conversationAggregation[0]!._id,
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
            },
          });
          return updatedConversation!
            ? conversationAggregation[0]
            : conversation;
        }
      } catch (error) {
        console.log(error);
        throw new Error(error);
      }
    },
    acceptInvitation: async (
      _,
      { conversationId },
      { authenticatedUser }: OwnContext
    ) => {
      try {
        const conversation = await Conversation.find({
          conversationId: { $eq: conversationId },
        }).populate("members");
        if (
          conversation[0].participants.some(
            (user) => user.userId === authenticatedUser!._id
          )
        ) {
          if (
            conversation.length &&
            !conversation[0]!.acceptedInvitation.includes(
              authenticatedUser!._id
            )
          ) {
            return await Conversation.findOneAndUpdate(
              {
                conversationId: { $eq: conversationId },
              },
              {
                $set: {
                  acceptedInvitation: [
                    ...conversation[0]!.acceptedInvitation,
                    authenticatedUser._id,
                  ],
                },
              },
              { new: true }
            );
          } else {
            throw new Error(
              "Couldn't find the conversation between these users."
            );
          }
        } else {
          throw new Error("you weren't invited");
        }
      } catch (error) {
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
          messagedata: { senderId, text: text, receiverId },
        });

        if (newMessage && newMessage.id) {
          redisPubSub.publish("message_sent", {
            messageSent: {
              id: newMessage._id,
              conversationId: newMessage.conversationId,
              messagedata: newMessage.messagedata,
            },
          });
          const messages = await Message.find({
            conversationId: conversationId,
          });
          const updatedConversation = await Conversation.findOneAndUpdate(
            {
              conversationId: { $eq: conversationId },
              "participants.userId": { $eq: senderId },
            },
            {
              $set: {
                "participants.$.lastReadMessageId": newMessage!.id!,
                "participants.$.lastSeenMessageId": newMessage!.id!,
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
                  weSendIt: authenticatedUser!._id,
                },
                pipeline: [
                  {
                    $match: {
                      $expr: {
                        $and: [
                          { $eq: ["$conversationId", "$$conversationId"] },
                          // { $ne: ["$messagedata.senderId", "$$weSendIt"] },
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
            },
          });
        }
        return newMessage;
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
          return payload.conversationUpdated.message
            ? payload.conversationUpdated.message.messagedata.receiverId ===
                variables.userId ||
                payload.conversationUpdated.message.messagedata.senderId ===
                  variables.userId
            : payload.conversationUpdated.conversation.participants.some(
                (participant: any) => participant.userId === variables.userId
              );
        }
      ),
    },
    messageSent: {
      subscribe: withFilter(
        () => redisPubSub.asyncIterator("message_sent"),
        (payload, variables) => {
          return (
            payload.messageSent.conversationId === variables.conversationId
          );
        }
      ),
    },
  },
} as IResolvers;
