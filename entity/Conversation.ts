import { Document, model, Model, Schema, Types } from "mongoose";

interface IConversationSchema extends Document {
  id: string;
  conversationId: string;
  members: Types.Array<Document>;
  type: string;
}

export interface IConversation extends IConversationSchema {}

export interface IConversationModel extends Model<IConversation> {}

const schema: Schema<IConversation> = new Schema(
  {
    conversationId: {
      type: String,
    },
    type: {
      type: String,
    },
    members: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
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
