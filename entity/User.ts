import { Document, model, Model, Types, Schema } from "mongoose";
import { hash, compare } from "bcryptjs";
import { IPost } from "./Post";
var uniqueValidator = require("mongoose-unique-validator");

interface IUserSchema extends Document {
  username: string;
  name: string;
  email: string;
  password: string;
  isAdmin: boolean;
  bio: string;
  website: string;
  avatar: string;
  posts: IPost[];
  followers: Types.Array<Document>;
  following: Types.Array<Document>;
  tokenVersion: number;
}

export interface IUser extends IUserSchema {
  followersCount: number;
  followingCount: number;
  comparePassword: (password: string) => Promise<Boolean>;
}

export interface IUserModel extends Model<IUser> {}

const schema: Schema<IUser> = new Schema({
  username: {
    type: String,
    unique: true,
  },
  name: {
    type: String,
  },
  email: {
    type: String,
    unique: true,
  },
  password: {
    type: String,
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
  bio: { type: String },
  website: { type: String },
  avatar: String,
  followers: [
    {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  following: [
    {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  tokenVersion: {
    type: Number,
    default: 0,
  },
});

schema.plugin(uniqueValidator, {
  message: "the {PATH} is already taken.",
});

schema.pre<IUser>("save", async function (next) {
  if (!this.avatar) {
    this.avatar =
      "https://res.cloudinary.com/chimson/image/upload/v1596460624/new-client/placeholder.png";
  }

  if (!this.isModified("password")) return next();

  try {
    const hashedPassword = await hash(this.password, 12);
    this.password = hashedPassword;
    next();
  } catch (error) {}
});

schema.methods.comparePassword = async function (password: string) {
  return await compare(password, this.password);
};

export default model<IUser, IUserModel>("User", schema);
