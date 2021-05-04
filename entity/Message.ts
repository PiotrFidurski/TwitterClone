import { Document, model, Model, Schema } from "mongoose";

interface IMessageSchema extends Document {
  id: string;
  conversationId: String;
  messagedata: {
    id: string;
    text: string;
    conversationId: String;
    senderId: string;
    receiverId: string;
  };
}

export interface IMessage extends IMessageSchema {}

export interface IMessageModel extends Model<IMessage> {}

const schema: Schema<IMessage> = new Schema(
  {
    conversationId: String,
    messagedata: {
      id: String,
      text: String,
      conversationId: String,
      senderId: String,
      receiverId: String,
    },
  },
  { timestamps: true }
);

schema.pre<IMessage>("save", async function (next) {
  this.messagedata.id = this.id;
  this.messagedata.conversationId = this.conversationId;
  next();
});

export default model<IMessage, IMessageModel>("Message", schema);
