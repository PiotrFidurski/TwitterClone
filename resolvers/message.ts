import User from "../entity/User";
import { IResolvers } from "graphql-tools";
import { OwnContext } from "types";
import Conversation from "../entity/Conversation";
import Message from "../entity/Message";
import { RedisPubSub } from "graphql-redis-subscriptions";
import { withFilter } from "graphql-subscriptions";
import Redis from "ioredis";

const redisOne = new Redis({
  host: `${process.env.REDIS_HOST}`,
  port: 18964,
  password: process.env.REDIS_PASSWORD,
  username: process.env.REDIS_USERNAME,
  retryStrategy: (options: any) => Math.max(options.attempt * 100, 3000),
});
const redisTwo = new Redis({
  host: `${process.env.REDIS_HOST}`,
  port: 18964,
  password: process.env.REDIS_PASSWORD,
  username: process.env.REDIS_USERNAME,
  retryStrategy: (options: any) => Math.max(options.attempt * 100, 3000),
});
const redisPubSub = new RedisPubSub({
  subscriber: redisOne,
  publisher: redisTwo,
});

export default {
  Query: {
    userConversations: async (_, {}, { authenticatedUser }: OwnContext) => {
      const user = await User.findById(authenticatedUser._id);
      const conversations = await Conversation.find({
        members: { $in: [user!.id] },
      }).populate("members");

      return conversations;
    },
    conversationMessages: async (_, { conversationId }) => {
      try {
        const messages = await Message.find({
          conversationId: { $eq: conversationId },
        });
        return messages;
      } catch (error) {
        throw new Error(error);
      }
    },
    directconversation: async (_, { conversationId }) => {
      try {
        const conversation = await Conversation.findById(
          conversationId
        ).populate("members");
        return conversation;
      } catch (error) {
        throw new Error(error);
      }
    },
  },
  Mutation: {
    createConversation: async (_, { userIds }) => {
      const type = userIds.length > 2 ? "GROUP_DM" : "ONE_ON_ONE";
      try {
        const users = await User.find({
          _id: { $in: userIds },
        });

        const newConversation = await Conversation.create({
          members: users,
          type,
        });

        return newConversation;
      } catch (error) {
        throw new Error(error);
      }
    },
    addPeopleToConversation: async (
      _,
      { userIds, conversationId },
      { authenticatedUser }: OwnContext
    ) => {
      try {
        if (conversationId) {
          const conversation = await Conversation.find({
            conversationId: conversationId,
          }).populate("members");
          if (conversation[0].type !== "ONE_TO_ONE") {
            throw new Error("this conversation is one on one only");
          } else {
            const users = await User.find({
              $and: [
                { _id: { $in: userIds } },
                { _id: { $nin: conversation![0].members } },
              ],
            });
            await Conversation.updateOne(
              {
                _id: { $eq: conversation[0]._id },
              },
              { $set: { members: [...conversation![0].members, ...users] } }
            );

            return conversation[0];
          }
        } else {
          const alreadyExisting = await Conversation.find({
            members: { $in: userIds },
          });
          if (alreadyExisting[0]) {
            throw new Error("this group DM already exists");
          }
          const authUser = await User.findById(authenticatedUser._id);
          const users = await User.find({
            _id: { $in: userIds },
          });
          if (users.length === 1) {
            const alreadyMessaged = await Conversation.find({
              conversationId: `${authUser!.id}-${users[0].id}`,
            });
            if (!alreadyMessaged.length) {
              const conversation = await (
                await Conversation.create({
                  members: [authUser, ...users],
                  type: "ONE_ON_ONE",
                  conversationId: `${authUser!.id}-${users[0].id}`,
                })
              ).populate("members");
              return conversation;
            } else {
              throw new Error("this conversation already exists.");
            }
          }

          const conversation = await (
            await Conversation.create({
              members: [authUser, ...users],
              type: "GROUP_DM",
            })
          ).populate("members");

          return conversation;
        }
      } catch (error) {
        throw new Error(error);
      }
    },
    sendMessage: async (_, { text, conversationId, senderId }) => {
      try {
        const newMessage = await Message.create({
          conversationId,
          messagedata: { senderId, text: text },
        });

        if (newMessage && newMessage.id) {
          redisPubSub.publish("message_sent", {
            messageSent: {
              id: newMessage._id,
              conversationId: newMessage.conversationId,
              messagedata: newMessage.messagedata,
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
