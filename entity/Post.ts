import { Document, model, Model, Schema, Types } from "mongoose";
import { IUser } from "./User";

interface IPostSchema extends Document {
  id: string;
  body: string;
  owner: IUser;
  conversationId: String;
  inReplyToId: String;
  conversation: Types.Array<Document>;
  likes: Types.Array<Document>;
}

export interface IPost extends IPostSchema {
  likesCount: number;
  replyCount: number;
  isOwner: (doc: Document) => boolean;
}

export interface IPostModel extends Model<IPost> {}

const schema: Schema<IPost> = new Schema(
  {
    body: {
      type: String,
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    conversationId: {
      type: Schema.Types.ObjectId,
      ref: "Post",
    },
    inReplyToId: {
      type: Schema.Types.ObjectId,
      ref: "Post",
    },
    conversation: [
      {
        type: Schema.Types.ObjectId,
        ref: "Post",
      },
    ],
    likes: [{ type: Schema.Types.ObjectId, ref: "User" }],
  },
  { timestamps: true }
);

schema.pre<IPost>("save", async function (next) {
  await this.populate({
    path: "owner",
  }).execPopulate();
  next();
});

schema.methods.isOwner = function (doc: Document) {
  return this.owner.equals(doc._id);
};

export default model<IPost, IPostModel>("Post", schema);
