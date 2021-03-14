import Post, { IPost } from "../entity/Post";

export const postPipeline = [
  {
    $lookup: {
      from: "posts",
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
    $lookup: {
      from: "posts",
      localField: "conversation",
      foreignField: "_id",
      as: "conversation",
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
  { $addFields: { modelType: "Post" } },
  { $addFields: { likesCount: "$likesCount.count" } },
  { $addFields: { replyCount: "$replyCount.count" } },
];

export const fetchMorePosts = async (
  post: IPost,
  array: Array<string>
): Promise<Array<string>> => {
  if (!post.conversation.length) {
    return array;
  } else {
    const nextPost = await Post.findOne({ inReplyToId: post.id })
      .sort({
        createdAt: -1,
      })
      .populate("conversation")
      .populate("owner");

    array = [...array, nextPost!.id];
    return await fetchMorePosts(nextPost!, array);
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
