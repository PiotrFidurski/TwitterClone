import { isValidObjectId, MongooseDocument } from "mongoose";
import Tweet, { ITweet } from "../entity/Tweet";

export const tweetPipeline = [
  {
    $lookup: {
      from: "tweets",
      let: { id: "$_id" },
      pipeline: [
        { $match: { $expr: { $eq: ["$inReplyToId", "$$id"] } } },
        {
          $group: { _id: null, count: { $sum: 1 } },
        },
      ],
      as: "replyCount",
    },
  },
  {
    $lookup: {
      from: "users",
      let: { likes: "$likes" },
      pipeline: [
        { $match: { $expr: { $in: ["$_id", "$$likes"] } } },
        {
          $group: { _id: null, count: { $sum: 1 } },
        },
      ],
      as: "likesCount",
    },
  },
  {
    $lookup: {
      from: "users",
      let: { owner: "$owner" },
      pipeline: [
        {
          $match: {
            $expr: { $eq: ["$_id", "$$owner"] },
          },
        },
        {
          $lookup: {
            from: "users",
            let: { followers: "$followers" },
            pipeline: [
              { $match: { $expr: { $in: ["$_id", "$$followers"] } } },
              {
                $group: {
                  _id: null,
                  count: { $sum: 1 },
                  document: { $push: "$$ROOT" },
                },
              },
            ],
            as: "_followers",
          },
        },
        {
          $addFields: {
            followers: "$_followers.document",
          },
        },
        {
          $addFields: {
            followersCount: {
              $cond: [
                { $ne: ["$_followers.count", []] },
                "$_followers.count",
                0,
              ],
            },
          },
        },
        {
          $unwind: "$followersCount",
        },
        {
          $unwind: {
            path: "$followers",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $lookup: {
            from: "users",
            let: { following: "$following" },
            pipeline: [
              { $match: { $expr: { $in: ["$_id", "$$following"] } } },
              {
                $group: {
                  _id: null,
                  count: { $sum: 1 },
                  document: { $push: "$$ROOT" },
                },
              },
            ],
            as: "_following",
          },
        },
        {
          $addFields: {
            following: "$_following.document",
          },
        },
        {
          $addFields: {
            followingCount: {
              $cond: [
                { $ne: ["$_following.count", []] },
                "$_following.count",
                0,
              ],
            },
          },
        },
        {
          $unwind: "$followingCount",
        },
        {
          $unwind: {
            path: "$following",
            preserveNullAndEmptyArrays: true,
          },
        },
      ],
      as: "owner",
    },
  },
  {
    $lookup: {
      from: "users",
      localField: "likes",
      foreignField: "_id",
      as: "likes",
    },
  },
  {
    $unwind: {
      path: "$replyCount",
      preserveNullAndEmptyArrays: true,
    },
  },
  {
    $unwind: {
      path: "$likesCount",
      preserveNullAndEmptyArrays: true,
    },
  },
  { $unwind: "$owner" },
  {
    $addFields: {
      modelType: "Tweet",
      likesCount: { $size: "$likes" },
      replyCount: "$replyCount.count",
    },
  },
];

export const fetchMoreTweets = async (
  tweet: ITweet,
  array: Array<string>
): Promise<Array<string>> => {
  if (!tweet.replyCount) {
    return array;
  } else {
    const nextTweet = await Tweet.aggregate([
      { $match: { inReplyToId: { $eq: tweet._id } } },
      ...tweetPipeline,
    ]);

    array = [...array, nextTweet![0]._id];
    return await fetchMoreTweets(nextTweet![0], array);
  }
};

export const userPipeline = [
  {
    $lookup: {
      from: "users",
      let: { followers: "$followers" },
      pipeline: [
        { $match: { $expr: { $in: ["$_id", "$$followers"] } } },
        {
          $group: {
            _id: null,
            count: { $sum: 1 },
            document: { $push: "$$ROOT" },
          },
        },
      ],
      as: "_followers",
    },
  },
  {
    $addFields: {
      followers: "$_followers.document",
    },
  },
  {
    $addFields: {
      followersCount: {
        $cond: [{ $ne: ["$_followers.count", []] }, "$_followers.count", 0],
      },
    },
  },
  {
    $unwind: "$followersCount",
  },
  {
    $unwind: {
      path: "$followers",
      preserveNullAndEmptyArrays: true,
    },
  },
  {
    $lookup: {
      from: "users",
      let: { following: "$following" },
      pipeline: [
        { $match: { $expr: { $in: ["$_id", "$$following"] } } },
        {
          $group: {
            _id: null,
            count: { $sum: 1 },
            document: { $push: "$$ROOT" },
          },
        },
      ],
      as: "_following",
    },
  },
  {
    $addFields: {
      following: "$_following.document",
    },
  },
  {
    $addFields: {
      followingCount: {
        $cond: [{ $ne: ["$_following.count", []] }, "$_following.count", 0],
      },
    },
  },
  {
    $unwind: "$followingCount",
  },
  {
    $unwind: {
      path: "$following",
      preserveNullAndEmptyArrays: true,
    },
  },
  { $addFields: { modelType: "User" } },
  { $unwind: "$avatar" },
  { $unset: ["_following", "_followers"] },
];

export const conversationPipeline = [
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
  { $addFields: { modelType: "Conversation" } },
];

export const resolve = (
  obj: { node: MongooseDocument; message: string },
  options: { success: string; error: string }
) => {
  if (obj.node || !Object.keys(obj).includes("message")) {
    return options.success;
  }
  if (obj.message) {
    return options.error;
  }
  return null;
};

export function checkForValidObjectIds(
  ids: { [key: string]: string },
  customMessage?: string
) {
  return Object.entries(ids)
    .map((entry) => {
      const [name, value] = entry;
      if (!isValidObjectId(value)) {
        if (customMessage) throw new Error(customMessage);
        throw new Error(`${name}, is not a valid objectId`);
      }
      return null;
    })
    .filter((v) => v !== null);
}
