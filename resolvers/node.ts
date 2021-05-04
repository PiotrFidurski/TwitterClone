import { IResolvers } from "graphql-tools";
import { GraphQLResolveInfo, InlineFragmentNode } from "graphql";
import models from "../entity";
import { Types } from "mongoose";
import {
  userPipeline,
  tweetPipeline,
  conversationPipeline,
} from "../utilities/resolverUtils";
import User from "../entity/User";
import Tweet from "../entity/Tweet";
import Conversation from "../entity/Conversation";
import LastSeenMessage from "../entity/Conversation/LastSeenMessage";

const aggregatePipelines = {
  Tweet: tweetPipeline,
  User: userPipeline,
  Conversation: conversationPipeline,
} as { [key: string]: Array<any> };

export const generateTypeName = (
  info: GraphQLResolveInfo
): { __typename: string } => {
  return info.fieldNodes.reduce<any>(
    (prevValue: InlineFragmentNode, currentValue) => {
      currentValue.selectionSet!.selections.filter((selection) => {
        return Object.keys(selection).some((key) => {
          if (key === "typeCondition") {
            prevValue = selection as InlineFragmentNode;
          }
        });
      });

      return {
        __typename: prevValue.typeCondition!.name.value,
      };
    },
    {} as InlineFragmentNode
  );
};

export default {
  Node: {
    __resolveType(obj: any) {
      if (obj.modelType === "User" || obj instanceof User) return "User";
      if (obj.modelType === "Tweet" || obj instanceof Tweet) return "Tweet";
      if (obj.modelType === "Conversation" || obj instanceof Conversation)
        return "Conversation";
      if (obj.modelType === "LastSeenMessage" || obj instanceof LastSeenMessage)
        return "LastSeenMessage";
      return false;
    },
  },
  Error: {
    __resolveType() {
      return null;
    },
  },
  Query: {
    node: async (_, args, context, info) => {
      const { __typename } = generateTypeName(info);

      const Model = models[__typename];

      const node = await Model.aggregate([
        {
          $match: {
            _id: { $eq: Types.ObjectId(args.id) },
          },
        },
        ...aggregatePipelines[__typename],
      ]);

      return node[0];
    },
  },
} as IResolvers;
