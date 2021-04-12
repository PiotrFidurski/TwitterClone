import { Document, model, Model, Schema } from "mongoose";

interface ILeftConversationAtSchema extends Document {
  id: string;
  leftAtMessageId: string;
  userId: string;
  conversationId: string;
}

export interface ILeftConversationAt extends ILeftConversationAtSchema {}

export interface ILeftConversationAtModel extends Model<ILeftConversationAt> {}

const schema: Schema<ILeftConversationAt> = new Schema({
  leftAtMessageId: { type: String },
  userId: { type: String },
  conversationId: { type: String },
});

export default model<ILeftConversationAt, ILeftConversationAtModel>(
  "LeftConversationAt",
  schema
);
