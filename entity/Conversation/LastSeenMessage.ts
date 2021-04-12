import { Document, model, Model, Schema } from "mongoose";

interface ILastSeenMessageSchema extends Document {
  id: string;
  lastSeenMessageId: string;
  userId: string;
}

export interface ILastSeenMessage extends ILastSeenMessageSchema {}

export interface ILastSeenMessageModel extends Model<ILastSeenMessage> {}

const schema: Schema<ILastSeenMessage> = new Schema({
  lastSeenMessageId: { type: String },
  userId: { type: String },
});

export default model<ILastSeenMessage, ILastSeenMessageModel>(
  "LastSeenMessage",
  schema
);
