import User from "../entity/User";
import { IResolvers } from "graphql-tools";
import { OwnContext } from "types";
import Conversation from "../entity/Conversation/index";
import LeftConversationAt from "../entity/Conversation/LeftConversationAt";
import LastSeenMessage from "../entity/Conversation/LastSeenMessage";
import {
  resolve,
  conversationPipeline,
  checkForValidObjectIds,
} from "../utilities/resolverUtils";

export default {
  Query: {
    leftAt: async (_, { userId, conversationId }) => {
      try {
        const [
          firstHalfofConversationId,
          secondHalfofConversationId,
        ] = conversationId.split("-");
        checkForValidObjectIds({
          userId,
          firstHalfofConversationId,
          secondHalfofConversationId,
        });
        if (!conversationId || !userId)
          throw new Error(
            "argument of conversationId or userId was not provided"
          );
        const leftAt = await LeftConversationAt.findOne({
          userId: userId,
          conversationId: conversationId,
        });

        if (!leftAt) {
          throw new Error(
            "This record might not exist yet, or the input is invalid."
          );
        }

        return {
          node: leftAt,
        };
      } catch (error) {
        return {
          message: error.message,
          userId: userId,
          conversationId: conversationId,
        };
      }
    },
  },
  Mutation: {
    messageUser: async (_, { userId }, { authenticatedUser }: OwnContext) => {
      try {
        const authUser = await User.findById(authenticatedUser._id);

        const authLastSeenMessage = await LastSeenMessage.findOne({
          userId: { $eq: authenticatedUser!._id },
        });
        if (!userId) throw new Error("argument of userId was not provided.");
        checkForValidObjectIds({ userId });

        const usersLastSeenMessage = await LastSeenMessage.findOne({
          userId: { $eq: userId },
        });
        if (!usersLastSeenMessage) {
          await LastSeenMessage.create({
            userId: userId!,
            lastSeenMessageId: "",
          });
        }
        if (!authLastSeenMessage) {
          await LastSeenMessage.create({
            userId: authenticatedUser!._id,
            lastSeenMessageId: "",
          });
        }
        const areInConversation = await Conversation.find({
          $or: [
            {
              conversationId: {
                $eq: `${authUser!.id}-${userId}`,
              },
            },
            {
              conversationId: {
                $eq: `${userId}-${authUser!.id}`,
              },
            },
          ],
        });

        if (areInConversation.length) {
          const conversationAggregation = await Conversation.aggregate([
            { $match: { _id: areInConversation[0]._id } },
            ...conversationPipeline,
          ]);
          return {
            node: conversationAggregation[0],
          };
        } else {
          const conversation = await Conversation.create({
            participants: [
              {
                userId: authUser!.id,
                lastReadMessageId: "",
              },
              {
                userId: userId!,
                lastReadMessageId: "",
              },
            ],
            type: "ONE_ON_ONE",
            lastReadMessageId: "",
            mostRecentEntryId: "",
            oldestEntryId: "",
            conversationId: `${authUser!.id}-${userId}`,
          });

          const conversationAggregation = await Conversation.aggregate([
            {
              $match: {
                conversationId: conversation!.conversationId,
              },
            },
            ...conversationPipeline,
          ]);

          return {
            node: conversationAggregation[0],
          };
        }
      } catch (error) {
        return {
          message: error.message,
          userId,
        };
      }
    },
    readConversation: async (
      _,
      { conversationId, messageId },
      { authenticatedUser }: OwnContext
    ) => {
      try {
        if (!conversationId || !messageId)
          throw new Error(
            "argument of conversationId or messageId was not provided"
          );

        const [
          firstHalfofConversationId,
          secondHalfofConversationId,
        ] = conversationId.split("-");

        checkForValidObjectIds({
          messageId,
          firstHalfofConversationId,
          secondHalfofConversationId,
        });

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
        if (!updatedConversation) {
          throw new Error(
            "This record might not exist yet, or the input is invalid."
          );
        }
        return {
          node: updatedConversation,
          status: true,
        };
      } catch (error) {
        return {
          message: error.message,
          messageId: messageId,
          conversationId: conversationId,
        };
      }
    },
    leaveConversation: async (
      _,
      { conversationId },
      { authenticatedUser }: OwnContext
    ) => {
      try {
        if (!conversationId) {
          throw new Error("argument of conversationId was not provided");
        }
        const [
          firstHalfofConversationId,
          secondHalfofConversationId,
        ] = conversationId.split("-");

        checkForValidObjectIds({
          firstHalfofConversationId,
          secondHalfofConversationId,
        });

        const user = await User.findById(authenticatedUser!._id);
        const leftAt = await LeftConversationAt.findOne({
          userId: authenticatedUser!._id,
          conversationId: conversationId,
        });

        const conversationToBeLeft = await Conversation.findOne({
          conversationId: conversationId,
        });
        if (leftAt) {
          await LeftConversationAt.findOneAndUpdate(
            { _id: { $eq: leftAt!._id } },
            {
              $set: {
                leftAtMessageId: conversationToBeLeft!.participants!.filter(
                  (user) => user.userId === authenticatedUser!._id
                )[0].lastReadMessageId,
              },
            },
            { new: true }
          );
        } else {
          await LeftConversationAt.create({
            userId: authenticatedUser!._id,
            leftAtMessageId: conversationToBeLeft!.participants!.filter(
              (user) => user.userId === authenticatedUser!._id
            )[0].lastReadMessageId,
            conversationId: conversationId,
          });
        }
        const updatedConversation = await Conversation.findOneAndUpdate(
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
        if (!updatedConversation)
          throw new Error(
            "This record might not exist yet, or the input is invalid."
          );
        return {
          node: updatedConversation,
          status: true,
        };
      } catch (error) {
        return {
          message: error.message,
          conversationId: conversationId,
        };
      }
    },
    seeMessage: async (_, { messageId }, { authenticatedUser }: OwnContext) => {
      try {
        if (!messageId)
          throw new Error("argument of messageId was not provided.");
        checkForValidObjectIds({ messageId });

        const updatedLastSeenMessage = await LastSeenMessage.findOneAndUpdate(
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

        return {
          node: updatedLastSeenMessage,
          status: true,
        };
      } catch (error) {
        return {
          message: error.message,
          messageId: messageId,
        };
      }
    },
  },
  Conversation: {
    id: (parent) => {
      return parent.id || parent._id;
    },
  },
  LastSeenMessage: {
    id: (parent) => {
      return parent.id || parent._id;
    },
  },
  MessageUserResult: {
    __resolveType(obj: any) {
      return resolve(obj, {
        success: "MessageUserSuccess",
        error: "MessageUserInvalidInputError",
      });
    },
  },
  LeftAtResult: {
    __resolveType(obj: any) {
      return resolve(obj, {
        success: "LeftAtSuccess",
        error: "LeftAtInvalidInputError",
      });
    },
  },
  ReadConversationResult: {
    __resolveType(obj: any) {
      return resolve(obj, {
        success: "UpdateResourceResponse",
        error: "ReadConversationInvalidInputError",
      });
    },
  },
  LeaveConversationResult: {
    __resolveType(obj: any) {
      return resolve(obj, {
        success: "UpdateResourceResponse",
        error: "LeaveConversationInvalidInputError",
      });
    },
  },
  SeeMessageResult: {
    __resolveType(obj: any) {
      return resolve(obj, {
        success: "UpdateResourceResponse",
        error: "SeeMessageInvalidInputError",
      });
    },
  },
} as IResolvers;
