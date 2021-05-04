import { Document, model, Model, Schema, Types } from "mongoose";
import { IUser } from "./User";

interface ITweetSchema extends Document {
  id: string;
  body: string;
  owner: IUser;
  conversationId: String;
  inReplyToId: String;
  likes: Types.Array<Document>;
}

export interface ITweet extends ITweetSchema {
  likesCount: number;
  replyCount: number;
  isOwner: (doc: Document) => boolean;
}

export interface ITweetModel extends Model<ITweet> {}

const schema: Schema<ITweet> = new Schema(
  {
    body: String,
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    conversationId: {
      type: Schema.Types.ObjectId,
      ref: "Tweet",
    },
    inReplyToId: {
      type: Schema.Types.ObjectId,
      ref: "Tweet",
    },
    likes: [{ type: Schema.Types.ObjectId, ref: "User" }],
  },
  { timestamps: true }
);

schema.pre<ITweet>("save", async function (next) {
  await this.populate({
    path: "owner",
  }).execPopulate();

  next();
});

schema.methods.isOwner = function (doc: Document) {
  return this.owner.equals(doc._id);
};

export default model<ITweet, ITweetModel>("Tweet", schema);
