import { SchemaDirectiveVisitor, IResolvers } from "graphql-tools";
import { GraphQLField, defaultFieldResolver } from "graphql";
import { OwnContext } from "../../types";
import { authenticate } from "../../utilities/auth";
import { Validators } from "./types";
import { ApolloError } from "apollo-server-core";
import Post from "../../entity/Post";

export const validators: Validators = {
  ownsAccount: ({ ...passedArgs }: any) => {
    const { args, context } = passedArgs;

    if (args.userId !== context.authenticatedUser._id) {
      throw new ApolloError(
        "You do not have permission to perform this action.",
        "401"
      );
    }
    return true;
  },
  ownsPost: async ({ ...passedArgs }: any) => {
    const { args, context } = passedArgs;

    const post = await Post.findById(args.id).populate("owner");
    if (post && post!.owner.id !== context.authenticatedUser!._id) {
      throw new ApolloError(
        "You do not have permission to perform this action.",
        "401"
      );
    }
    return true;
  },
};

const determinePermission = async (
  permissions: any,
  { ...passedArgs }: any
) => {
  const { context } = passedArgs;
  const auth = authenticate(context) as any;
  const permission: string =
    permissions && permissions.map((role: string) => role);

  context.authenticatedUser = auth;
  if (permissions && permissions.length) {
    await validators[permission](passedArgs);
  }
};

class AuthDirective extends SchemaDirectiveVisitor {
  public visitFieldDefinition(field: GraphQLField<any, OwnContext>) {
    const { resolve = defaultFieldResolver } = field;
    field.resolve = async (
      parent,
      args,
      context,
      info
    ): Promise<IResolvers> => {
      await determinePermission(this.args.requires, {
        args,
        context,
        info,
      });

      return resolve.call(this, parent, args, context, info);
    };
  }
}

export default AuthDirective;
