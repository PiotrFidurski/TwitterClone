import { IResolvers } from "graphql-tools";
import { OwnContext } from "src/types";
import Post, { IPost } from "../entity/Post";
import User from "../entity/User";
import schema from "../schemaValidation/post";
import { Types } from "mongoose";
import { postPipeline, fetchMorePosts } from "../utilities/resolverUtils";
import { ApolloError } from "apollo-server-express";

export default {
  Query: {
    feed: async (_, { offset }, { authenticatedUser }: OwnContext) => {
      try {
        const user = await User.findById(authenticatedUser!._id);
        if (!user) {
          throw new Error("We couldn't find feed for the user.");
        }
        const following = user!.following!.map((user) => user._id);

        const latestPosts = await Post.aggregate([
          {
            $match: {
              $and: [{ owner: { $in: [...following, user!._id] } }],
            },
          },
          { $sort: { createdAt: -1 } },
          { $skip: Number(offset) },
          { $limit: 10 },
          ...postPipeline,
        ]);

        const feed = await Post.aggregate([
          {
            $facet: {
              parent: [
                {
                  $match: {
                    $and: [
                      {
                        _id: {
                          $in: [...latestPosts.map((post) => post.inReplyToId)],
                        },
                      },
                      {
                        _id: { $nin: [...latestPosts.map((post) => post.id)] },
                      },
                    ],
                  },
                },
              ],
              conversationPosts: [
                {
                  $match: {
                    _id: {
                      $in: [...latestPosts.map((post) => post.conversationId)],
                      $nin: [...latestPosts.map((post) => post!._id)],
                    },
                  },
                },
              ],
            },
          },
          {
            $project: {
              feed: {
                $setUnion: ["$conversationPosts", "$parent"],
              },
            },
          },
          { $unwind: "$feed" },
          { $replaceRoot: { newRoot: "$feed" } },
          ...postPipeline,
        ]);

        return {
          feed: [...latestPosts, ...feed],
          length: latestPosts.length > 0 ? latestPosts.length : 0,
        };
      } catch (error) {
        return error;
      }
    },
    conversation: async (_, { conversationId, postId }) => {
      try {
        const conversation = await Post.aggregate([
          {
            $match: {
              conversationId: {
                $eq: Types.ObjectId(conversationId),
              },
              _id: { $ne: Types.ObjectId(postId) },
            },
          },
          ...postPipeline,
          { $sort: { createdAt: -1 } },
        ]);

        return conversation;
      } catch (error) {
        return error;
      }
    },
    post: async (_, { postId }) => {
      try {
        const post = await Post.aggregate([
          {
            $match: {
              _id: { $eq: Types.ObjectId(postId) },
            },
          },
          ...postPipeline,
        ]);

        if (post.length === 0) {
          return new Error("Invalid ID");
        }

        return { node: post[0] };
      } catch (error) {
        return {
          message: error.message,
          id: postId,
        };
      }
    },
    replies: async (_, { postId, offset, loadMoreId }) => {
      try {
        if (loadMoreId && postId) {
          const post = await Post.findOne({ inReplyToId: loadMoreId })
            .populate("conversation")
            .populate("owner");

          const postIds = await fetchMorePosts(post!, []);
          postIds.unshift(post!.id);

          const posts = await Post.aggregate([
            {
              $match: { _id: { $in: postIds.map((id) => Types.ObjectId(id)) } },
            },
            ...postPipeline,
          ]);

          return posts;
        } else {
          const replies = await Post.aggregate([
            {
              $match: {
                inReplyToId: { $eq: Types.ObjectId(postId) },
              },
            },
            { $sort: { createdAt: -1 } },
            { $skip: Number(offset) },
            { $limit: 10 },
            ...postPipeline,
          ]);

          const firstReplies = await Post.aggregate([
            {
              $match: {
                inReplyToId: { $in: replies.map((reply) => reply._id) },
              },
            },
            ...postPipeline,
          ]);

          return [...replies, ...firstReplies];
        }
      } catch (error) {
        return error;
      }
    },
    userPosts: async (_, { userId, offset }) => {
      try {
        const posts = await Post.aggregate([
          {
            $match: {
              owner: { $eq: Types.ObjectId(userId) },
              inReplyToId: { $eq: null },
            },
          },
          { $sort: { createdAt: -1 } },
          { $skip: Number(offset) },
          { $limit: 10 },
          ...postPipeline,
        ]);
        return posts;
      } catch (error) {
        return error;
      }
    },
    likedPosts: async (_, { userId, offset }) => {
      try {
        const posts = await Post.aggregate([
          {
            $match: {
              likes: { $in: [Types.ObjectId(userId)] },
            },
          },
          { $sort: { createdAt: -1 } },
          { $skip: Number(offset) },
          { $limit: 10 },
          ...postPipeline,
        ]);

        return posts;
      } catch (error) {
        return error;
      }
    },
    postsAndReplies: async (_, { userId, offset }) => {
      try {
        const posts = await Post.aggregate([
          {
            $match: {
              inReplyToId: { $ne: null },
              owner: { $eq: Types.ObjectId(userId) },
            },
          },
          { $sort: { createdAt: -1 } },
          { $skip: Number(offset) },
          { $limit: 10 },
          ...postPipeline,
        ]);

        return posts;
      } catch (error) {
        return error;
      }
    },
  },
  Mutation: {
    createPost: async (
      _,
      { body, conversationId, inReplyToId },
      { authenticatedUser }: OwnContext
    ) => {
      try {
        await schema.validate({ body }, { abortEarly: false });
        const user = await User.findById(authenticatedUser._id).populate(
          "posts"
        );
        let newPost = {} as IPost;
        if (inReplyToId) {
          newPost = await Post.create({
            body: body,
            owner: user!.id,
            conversationId: conversationId,
            inReplyToId: inReplyToId,
          });
          await Post.updateOne(
            { _id: { $eq: inReplyToId } },
            { $push: { conversation: newPost } }
          );
        } else {
          newPost = await Post.create({
            body,
            owner: user!.id,
          });
          newPost!.conversationId = newPost.id;

          newPost!.save();
        }

        return newPost;
      } catch (error) {
        return error;
      }
    },
    deletePost: async (_, { id }) => {
      try {
        const post = await Post.findById(id);
        if (!post) {
          throw new ApolloError("this post doesn't exist.", "401");
        }
        if (post.inReplyToId) {
          await Post.findByIdAndUpdate(
            { _id: post.inReplyToId },
            { $pull: { conversation: post.id } }
          );
        }
        const deletePost = await Post.deleteOne({ _id: post!.id });

        return {
          node: post,
          status: deletePost.ok,
        };
      } catch (error) {
        return error;
      }
    },
    likePost: async (_, { id }, { authenticatedUser }: OwnContext) => {
      const user = await User.findById(authenticatedUser._id);
      try {
        const postLikeUpdate = await Post.updateOne(
          {
            _id: id,
            likes: { $nin: [user!.id] },
          },
          {
            $push: {
              likes: user!.id,
            },
          }
        );
        if (!postLikeUpdate.nModified) {
          await Post.updateOne({ _id: id }, { $pull: { likes: user!.id } });
        }
        const post = await Post.aggregate([
          { $match: { _id: Types.ObjectId(id) } },
          ...postPipeline,
        ]);

        return {
          node: post[0],
          status: true,
        };
      } catch (error) {
        throw new Error(error);
      }
    },
    loadMorePosts: async (_, { postId }) => {
      const post = await Post.findOne({ _id: postId })
        .populate("conversation")
        .populate("owner");

      const postIds = await fetchMorePosts(post!, []);
      postIds.unshift(post!.id);

      const posts = await Post.aggregate([
        { $match: { _id: { $in: postIds.map((id) => Types.ObjectId(id)) } } },
        ...postPipeline,
      ]);

      return posts;
    },
  },
} as IResolvers;
