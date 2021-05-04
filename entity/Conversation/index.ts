import { Document, model, Model, Schema, Types } from "mongoose";

interface IConversationSchema extends Document {
  id: string;
  conversationId: string;
  lastReadMessageId: string;
  mostRecentEntryId: string;
  oldestEntryId: string;
  participants: Types.Array<{
    userId: string;
    lastReadMessageId: string;
  }>;
  type: string;
}

export interface IConversation extends IConversationSchema {}

export interface IConversationModel extends Model<IConversation> {}

const schema: Schema<IConversation> = new Schema(
  {
    lastReadMessageId: String,
    mostRecentEntryId: String,
    oldestEntryId: String,
    conversationId: String,
    type: String,
    participants: [
      {
        _id: false,
        userId: String,
        lastReadMessageId: String,
      },
    ],
  },
  { timestamps: true }
);

schema.pre<IConversation>("save", async function (next) {
  if (this.type !== "ONE_ON_ONE") {
    this.conversationId = this.id;

    next();
  }
});

export default model<IConversation, IConversationModel>("Conversation", schema);
