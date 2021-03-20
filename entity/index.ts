import Post from "./Post";
import User from "./User";
import Message from "./Message";
import Conversation from "./Conversation";
import { Model } from "mongoose";

export default {
  Post,
  User,
  Message,
  Conversation,
} as { [key: string]: Model<any> };
