import { IResolvers } from "graphql-tools";
import { GraphQLResolveInfo, InlineFragmentNode } from "graphql";
import models from "../entity";
import { MongooseDocument, Types } from "mongoose";
import { userPipeline, postPipeline } from "../utilities/resolverUtils";
import User from "../entity/User";
import Post from "../entity/Post";

const aggregatePipelines = {
  Post: postPipeline,
  User: userPipeline,
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

const resolve = (
  obj: { node: MongooseDocument; message: string },
  options: { success: string; error: string }
) => {
  if (obj.node) {
    return options.success;
  }
  if (obj.message) {
    return options.error;
  }
  return null;
};

export default {
  PostByIdResult: {
    __resolveType(obj: any) {
      return resolve(obj, {
        success: "PostByIdSuccess",
        error: "PostByIdInvalidInputError",
      });
    },
  },
  UserByNameResult: {
    __resolveType(obj: any) {
      return resolve(obj, {
        success: "UserByNameSuccess",
        error: "UserByNameInvalidInputError",
      });
    },
  },
  UserUpdateResult: {
    __resolveType(obj: any) {
      return resolve(obj, {
        success: "UserUpdateSuccess",
        error: "UserUpdateInvalidInputError",
      });
    },
  },
  UserRegisterResult: {
    __resolveType(obj: any) {
      return resolve(obj, {
        success: "UserRegisterSuccess",
        error: "UserRegisterInvalidInputError",
      });
    },
  },
  UserLoginResult: {
    __resolveType(obj: any) {
      return resolve(obj, {
        success: "UserLoginSuccess",
        error: "UserLoginInvalidInputError",
      });
    },
  },
  Node: {
    __resolveType(obj: any) {
      if (obj.modelType === "User" || obj instanceof User) return "User";
      if (obj.modelType === "Post" || obj instanceof Post) return "Post";
      return false;
    },
  },
  Conversation: {
    id: (parent, args, context, info) => {
      return parent.id || parent._id;
    },
  },
  Message: {
    id: (parent, args, context, info) => {
      return parent.id || parent._id;
    },
  },
  User: {
    id: (parent, args, context, info) => {
      return parent.id || parent._id;
    },
  },
  Post: {
    id: (parent, args, context, info) => {
      return parent.id || parent._id;
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
        { $match: { _id: { $eq: Types.ObjectId(args.id) } } },
        ...aggregatePipelines[__typename],
      ]);

      return node[0];
    },
  },
} as IResolvers;
