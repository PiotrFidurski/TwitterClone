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
  leftAtMessageId: String,
  userId: String,
  conversationId: String,
});

export default model<ILeftConversationAt, ILeftConversationAtModel>(
  "LeftConversationAt",
  schema
);
