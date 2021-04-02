import { Document, model, Model, Schema, Types } from "mongoose";

// new structure
// we return object for user {conversations: [Conversation!], messages: [Message!], users:[User!], lastReadMessageId:String = last seen by current user}
// interface IConversationSchema extends Document {
//   id: string;
//   lastReadMessageId: string; this will basically be whatever the current users lastReadMessageId is
//   conversationId: string;
//   mostRecentEntryId: string;
//   oldestEntryId: string;
//   members: Types.Array<{userId:string; lastReadMessageId:string}>;
//   type: string;
//   acceptedInvitation: Types.Array<String>;
// }
// we receive this object of data on frontEnd
// if conversation.members.authUser.lastReadMEssageId !== conversation.mostRecentEntryId = new notification
// upon clicking the message tab we update MEMBERS.authUser.lastReadMEssageId
// whenever members.authuser.lastReadMessageId gets update we also update obj.lastReadMessageId
// whenever obj.lastReadMessageId updates we update conversation.lastReadMessageId

interface IConversationSchema extends Document {
  id: string;
  conversationId: string;
  lastReadMessageId: string;
  mostRecentEntryId: string;
  oldestEntryId: string;
  participants: Types.Array<{
    userId: string;
    lastReadMessageId: string;
    lastSeenMessageId: string;
  }>;
  type: string;
  acceptedInvitation: Types.Array<String>;
}

export interface IConversation extends IConversationSchema {}

export interface IConversationModel extends Model<IConversation> {}

const schema: Schema<IConversation> = new Schema(
  {
    lastReadMessageId: { type: String },
    mostRecentEntryId: { type: String },
    oldestEntryId: { type: String },
    conversationId: {
      type: String,
    },
    type: {
      type: String,
    },
    participants: [
      {
        userId: { type: String },
        lastReadMessageId: { type: String },
        lastSeenMessageId: { type: String },
      },
    ],

    acceptedInvitation: [{ type: String }],
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
