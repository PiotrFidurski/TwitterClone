import { IResolvers } from "graphql-tools";
import { OwnContext } from "../types";
import Tweet, { ITweet } from "../entity/Tweet";
import User from "../entity/User";
import schema from "../schemaValidation/post";
import { Types } from "mongoose";
import {
  tweetPipeline,
  fetchMoreTweets,
  checkForValidObjectIds,
  resolve,
} from "../utilities/resolverUtils";
import { ApolloError } from "apollo-server-express";

export default {
  Query: {
    feed: async (_, { after }, { authenticatedUser }: OwnContext) => {
      try {
        const user = await User.findById(authenticatedUser!._id);
        if (!user) {
          throw new Error("We couldn't find feed for the user.");
        }
        const following = user!.following!.map((user) => user._id);

        const latestTweets = await Tweet.aggregate([
          {
            $match: {
              owner: { $in: [...following, user!._id] },
              $expr: {
                $cond: {
                  if: { $ne: [after, undefined] },
                  then: {
                    $lt: ["$_id", Types.ObjectId(after)],
                  },
                  else: {},
                },
              },
            },
          },
          { $sort: { createdAt: -1 } },
          { $limit: 25 },
          ...tweetPipeline,
        ]);

        const feed = await Tweet.aggregate([
          {
            $facet: {
              parent: [
                {
                  $match: {
                    $and: [
                      {
                        _id: {
                          $in: [
                            ...latestTweets.map((tweet) => tweet.inReplyToId),
                          ],
                        },
                      },
                      {
                        _id: {
                          $nin: [...latestTweets.map((tweet) => tweet.id)],
                        },
                      },
                    ],
                  },
                },
              ],
              conversationTweets: [
                {
                  $match: {
                    _id: {
                      $in: [
                        ...latestTweets.map((tweet) => tweet.conversationId),
                      ],
                      $nin: [...latestTweets.map((tweet) => tweet!._id)],
                    },
                  },
                },
              ],
            },
          },
          {
            $project: {
              feed: {
                $setUnion: ["$conversationTweets", "$parent"],
              },
            },
          },
          { $unwind: "$feed" },
          { $replaceRoot: { newRoot: "$feed" } },
          ...tweetPipeline,
        ]);
        let hasNextPage = false;
        if (latestTweets[latestTweets.length - 1] !== undefined) {
          const result = await Tweet.aggregate([
            {
              $match: {
                owner: { $in: [...following, user!._id] },
                _id: { $lt: latestTweets[latestTweets.length - 1]._id },
              },
            },
          ]);

          if (result.length) {
            hasNextPage = true;
          }
        }

        return {
          pageInfo: {
            hasPreviousPage: false,
            hasNextPage: hasNextPage,
            startCursor: latestTweets.length ? latestTweets[0]._id : "",
            endCursor: latestTweets.length
              ? latestTweets[latestTweets.length - 1]._id
              : "",
          },
          count: latestTweets!.length,
          edges: [...latestTweets, ...feed],
        };
      } catch (error) {
        return error;
      }
    },
    conversation: async (_, { conversationId, tweetId }) => {
      try {
        checkForValidObjectIds(
          { conversationId, tweetId },
          "this thread seems to be gone."
        );
        const conversation = await Tweet.aggregate([
          {
            $match: {
              conversationId: {
                $eq: Types.ObjectId(conversationId),
              },
              _id: { $ne: Types.ObjectId(tweetId) },
            },
          },
          ...tweetPipeline,
          { $sort: { createdAt: -1 } },
        ]);

        return { edges: conversation };
      } catch (error) {
        return {
          message: error.message,
          conversationId,
          tweetId,
        };
      }
    },
    tweet: async (_, { tweetId }) => {
      try {
        checkForValidObjectIds({ tweetId }, "this tweet seems to be gone.");
        const tweet = await Tweet.aggregate([
          {
            $match: {
              _id: { $eq: Types.ObjectId(tweetId) },
            },
          },
          ...tweetPipeline,
        ]);
        if (!tweet.length) throw new Error("this tweet seems to be gone.");
        return { node: tweet[0] };
      } catch (error) {
        return {
          message: error.message,
          id: tweetId,
        };
      }
    },
    replies: async (_, { tweetId, after }) => {
      try {
        checkForValidObjectIds({ tweetId }, "replies couldn't be loaded");
        const replies = await Tweet.aggregate([
          {
            $match: {
              inReplyToId: { $eq: Types.ObjectId(tweetId) },
              $expr: {
                $cond: {
                  if: { $ne: [after, undefined] },
                  then: { $lt: ["$_id", Types.ObjectId(after)] },
                  else: {},
                },
              },
            },
          },
          { $sort: { createdAt: -1 } },
          { $limit: 25 },
          ...tweetPipeline,
        ]);
        if (!replies.length)
          return {
            pageInfo: {
              hasPreviousPage: false,
              hasNextPage: false,
              startCursor: "",
              endCursor: "",
            },
            count: 0,
            edges: [],
          };
        const repliesToreplies = await Tweet.aggregate([
          {
            $match: {
              inReplyToId: { $in: replies.map((reply) => reply._id) },
            },
          },
          ...tweetPipeline,
        ]);
        let hasNextPage = false;
        if (replies![replies!.length - 1] !== undefined) {
          const result = await Tweet.aggregate([
            {
              $match: {
                inReplyToId: { $eq: Types.ObjectId(tweetId) },
                _id: { $lt: replies[replies.length - 1]._id },
              },
            },
            { $sort: { createdAt: -1 } },
          ]);
          if (result.length) hasNextPage = true;
        }
        return {
          pageInfo: {
            hasPreviousPage: false,
            hasNextPage: hasNextPage,
            startCursor: replies[0]._id,
            endCursor: replies.length ? replies[replies.length - 1]._id : "",
          },
          count: replies!.length,
          edges: [...replies, ...repliesToreplies],
        };
      } catch (error) {
        return {
          message: error.message,
          tweetId,
          after,
        };
      }
    },
    userTweets: async (_, { userId, after }) => {
      try {
        checkForValidObjectIds(
          { userId, after },
          "Tweets couldn't be loaded at this time."
        );
        const tweets = await Tweet.aggregate([
          {
            $match: {
              owner: { $eq: Types.ObjectId(userId) },
              inReplyToId: { $eq: null },
              $expr: {
                $cond: {
                  if: { $ne: [after, undefined] },
                  then: { $lt: ["$_id", Types.ObjectId(after)] },
                  else: {},
                },
              },
            },
          },
          { $sort: { createdAt: -1 } },
          { $limit: 20 },
          ...tweetPipeline,
        ]);
        console.log(tweets);
        if (!tweets.length)
          return {
            pageInfo: {
              hasPreviousPage: false,
              hasNextPage: false,
              startCursor: "",
              endCursor: "",
            },
            count: 0,
            edges: [],
          };
        let hasNextPage = false;

        if (tweets[tweets.length - 1] !== undefined) {
          const result = await Tweet.aggregate([
            {
              $match: {
                owner: { $eq: Types.ObjectId(userId) },
                inReplyToId: { $eq: null },
                $expr: { $lt: ["$_id", tweets[tweets.length - 1]._id] },
              },
            },
            { $limit: 1 },
          ]);

          if (result.length) {
            hasNextPage = true;
          }
        }
        return {
          pageInfo: {
            hasPreviousPage: false,
            hasNextPage: hasNextPage,
            startCursor: tweets.length ? tweets[0]._id : "",
            endCursor:
              tweets[tweets.length - 1] !== undefined
                ? tweets[tweets.length - 1]._id
                : "",
          },
          count: tweets!.length,
          edges: tweets,
        };
      } catch (error) {
        return {
          message: error.message,
          after,
          userId,
        };
      }
    },
    userLikedTweets: async (_, { userId, after }) => {
      try {
        checkForValidObjectIds(
          { userId, after },
          "Tweets couldn't be loaded at this time."
        );

        const tweets = await Tweet.aggregate([
          {
            $match: {
              likes: { $in: [Types.ObjectId(userId)] },
              $expr: {
                $cond: {
                  if: { $ne: [after, undefined] },
                  then: { $lt: ["$_id", Types.ObjectId(after)] },
                  else: {},
                },
              },
            },
          },
          { $sort: { createdAt: -1 } },
          { $limit: 20 },
          ...tweetPipeline,
        ]);
        if (!tweets.length)
          return {
            pageInfo: {
              hasPreviousPage: false,
              hasNextPage: false,
              startCursor: "",
              endCursor: "",
            },
            count: 0,
            edges: [],
          };
        let hasNextPage = false;
        if (tweets![tweets!.length - 1] !== undefined) {
          const result = await Tweet.aggregate([
            {
              $match: {
                likes: { $in: [Types.ObjectId(userId)] },
                _id: { $lt: tweets![tweets!.length - 1]._id },
              },
            },
          ]);

          if (result.length) {
            hasNextPage = true;
          }
        }
        return {
          pageInfo: {
            hasPreviousPage: false,
            hasNextPage: hasNextPage,
            startCursor: tweets.length ? tweets[0]._id : "",
            endCursor:
              tweets[tweets.length - 1] !== undefined
                ? tweets[tweets.length - 1]._id
                : "",
          },
          count: tweets!.length,
          edges: tweets,
        };
      } catch (error) {
        return {
          message: error.message,
          after,
          userId,
        };
      }
    },
    userTweetsAndReplies: async (_, { userId, after }) => {
      try {
        checkForValidObjectIds(
          { userId, after },
          "Tweets can't be loaded at this time."
        );
        const tweets = await Tweet.aggregate([
          {
            $match: {
              inReplyToId: { $ne: null },
              owner: { $eq: Types.ObjectId(userId) },
              $expr: {
                $cond: {
                  if: { $ne: [after, undefined] },
                  then: { $lt: ["$_id", Types.ObjectId(after)] },
                  else: {},
                },
              },
            },
          },
          { $sort: { createdAt: -1 } },

          { $limit: 20 },
          ...tweetPipeline,
        ]);
        if (!tweets.length)
          return {
            pageInfo: {
              hasPreviousPage: false,
              hasNextPage: false,
              startCursor: "",
              endCursor: "",
            },
            count: 0,
            edges: [],
          };
        let hasNextPage = false;
        if (tweets![tweets!.length - 1] !== undefined) {
          const result = await Tweet.aggregate([
            {
              $match: {
                inReplyToId: { $ne: null },
                owner: { $eq: Types.ObjectId(userId) },
                $expr: { $lt: ["$_id", tweets[tweets.length - 1]._id] },
              },
            },
            { $limit: 1 },
          ]);

          if (result.length) {
            hasNextPage = true;
          }
        }
        return {
          pageInfo: {
            hasPreviousPage: false,
            hasNextPage: hasNextPage,
            startCursor: tweets.length ? tweets[0]._id : "",
            endCursor:
              tweets[tweets.length - 1] !== undefined
                ? tweets[tweets.length - 1]._id
                : "",
          },
          count: tweets!.length,
          edges: tweets,
        };
      } catch (error) {
        return {
          message: error.message,
          after,
          userId,
        };
      }
    },
  },
  Mutation: {
    repliesToTweet: async (_, { tweetId }) => {
      try {
        checkForValidObjectIds({ tweetId }, "Couldn't load more replies.");

        const tweet = await Tweet.aggregate([
          { $match: { inReplyToId: { $eq: Types.ObjectId(tweetId) } } },
          ...tweetPipeline,
        ]);
        const tweetIds = await fetchMoreTweets(tweet![0], []);
        tweetIds.unshift(tweet![0]._id);

        const tweets = await Tweet.aggregate([
          {
            $match: { _id: { $in: tweetIds } },
          },
          ...tweetPipeline,
          { $limit: 5 },
        ]);
        return {
          edges: tweets,
        };
      } catch (error) {
        return {
          message: error.message,
          tweetId,
        };
      }
    },
    createTweet: async (
      _,
      { body, conversationId, inReplyToId },
      { authenticatedUser }: OwnContext
    ) => {
      try {
        checkForValidObjectIds({ conversationId, inReplyToId });
        await schema.validate({ body }, { abortEarly: false });
        const user = await User.findById(authenticatedUser._id).populate(
          "posts"
        );

        let newTweet = {} as ITweet;
        if (inReplyToId) {
          newTweet = await Tweet.create({
            body: body,
            owner: user!.id,
            conversationId: conversationId,
            inReplyToId: inReplyToId,
          });
        } else {
          newTweet = await Tweet.create({
            body,
            owner: user!.id,
          });
          newTweet!.conversationId = newTweet.id;

          newTweet!.save();
        }

        return newTweet;
      } catch (error) {
        return {
          message: error.message,
          conversationId,
          inReplyToId,
          body,
        };
      }
    },
    deleteTweet: async (_, { tweetId }) => {
      try {
        checkForValidObjectIds({ tweetId });
        const tweet = await Tweet.findById(tweetId);
        if (!tweet) {
          throw new ApolloError("this tweet doesn't exist.", "401");
        }

        const deleteTweet = await Tweet.deleteOne({ _id: tweet!.id });

        return {
          node: tweet,
          status: deleteTweet.ok,
        };
      } catch (error) {
        return {
          message: error.message,
          tweetId,
        };
      }
    },
    likeTweet: async (_, { tweetId }, { authenticatedUser }: OwnContext) => {
      try {
        const user = await User.findById(authenticatedUser._id);

        checkForValidObjectIds({ tweetId }, "Couldn't like this tweet.");

        const tweetUpdate = await Tweet.updateOne(
          {
            _id: tweetId,
            likes: { $nin: [user!.id] },
          },
          {
            $push: {
              likes: user!.id,
            },
          }
        );
        if (!tweetUpdate.nModified) {
          await Tweet.updateOne(
            { _id: tweetId },
            { $pull: { likes: user!.id } }
          );
        }
        const tweet = await Tweet.aggregate([
          { $match: { _id: Types.ObjectId(tweetId) } },
          ...tweetPipeline,
        ]);

        return {
          node: tweet[0],
          status: true,
        };
      } catch (error) {
        return {
          message: error.message,
          tweetId,
        };
      }
    },
  },
  Tweet: {
    id: (parent) => {
      return parent.id || parent._id;
    },
  },
  ConversationResult: {
    __resolveType(obj: any) {
      return resolve(obj, {
        success: "ConversationSuccess",
        error: "ConversationInvalidInputError",
      });
    },
  },
  TweetResult: {
    __resolveType(obj: any) {
      return resolve(obj, {
        success: "TweetSuccess",
        error: "TweetInvalidInputError",
      });
    },
  },
  TweetsResult: {
    __resolveType(obj: any) {
      return resolve(obj, {
        success: "TweetConnection",
        error: "TweetsInvalidInputError",
      });
    },
  },
  RepliesToTweetResult: {
    __resolveType(obj: any) {
      return resolve(obj, {
        success: "RepliesToTweetSuccess",
        error: "RepliesToTweetInvalidInputError",
      });
    },
  },
  CreateTweetResult: {
    __resolveType(obj: any) {
      return resolve(obj, {
        success: "Tweet",
        error: "CreateTweetInvalidInputError",
      });
    },
  },
  DeleteTweetResult: {
    __resolveType(obj: any) {
      return resolve(obj, {
        success: "DeleteResourceResponse",
        error: "DeleteTweetInvalidInputError",
      });
    },
  },
  LikeTweetResult: {
    __resolveType(obj: any) {
      return resolve(obj, {
        success: "UpdateResourceResponse",
        error: "LikeTweetInvalidInputError",
      });
    },
  },
} as IResolvers;
