import Post from "./Post";
import User from "./User";
import { Model } from "mongoose";

export default {
  Post,
  User,
} as { [key: string]: Model<any> };
