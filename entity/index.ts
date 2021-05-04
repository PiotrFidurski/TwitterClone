import Tweet from "./Tweet";
import User from "./User";
import Message from "./Message";
import Conversation from "./Conversation/index";
import LastSeenMessage from "./Conversation/LastSeenMessage";
import { Model } from "mongoose";

export default {
  Tweet,
  User,
  Message,
  Conversation,
  LastSeenMessage,
} as { [key: string]: Model<any> };
