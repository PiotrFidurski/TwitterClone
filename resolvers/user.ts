import { IResolvers } from "graphql-tools";
import User from "../entity/User";
import {
  createAccessToken,
  createRefreshToken,
  sendRefreshToken,
} from "../utilities/auth";
import { OwnContext } from "../types";
import {
  loginSchema,
  registerSchema,
  updateSchema,
} from "../schemaValidation/user";
import formatErrors from "../utilities/formatErrors";
import { Types } from "mongoose";
import { userPipeline } from "../utilities/resolverUtils";
const cloudinary = require("cloudinary").v2;

export default {
  Query: {
    suggestedUsers: async () => {
      try {
        const users = await User.aggregate([...userPipeline]);

        return users;
      } catch (error) {
        return error;
      }
    },
    authUser: async (_, args, { authenticatedUser }: OwnContext) => {
      const user = await User.aggregate([
        {
          $match: { _id: { $eq: Types.ObjectId(authenticatedUser!._id) } },
        },
        ...userPipeline,
      ]);

      return user[0];
    },
    userByName: async (_, { username }) => {
      try {
        const user = await User.aggregate([
          { $match: { username: { $eq: username } } },
          ...userPipeline,
        ]);
        if (!user.length) {
          throw new Error("Invalid username");
        }
        return {
          node: user[0],
        };
      } catch (error) {
        return {
          message: error.message,
          username: username,
        };
      }
    },
  },
  Mutation: {
    register: async (_, { name, username, email, password }) => {
      try {
        await registerSchema.validate(
          { name, username, email, password },
          { abortEarly: false }
        );

        const user = new User({
          name,
          username,
          email,
          password,
        });

        await user.save();

        return { node: user };
      } catch (error) {
        const errors = formatErrors(
          error.inner ? error.inner[0] : Object.values(error.errors)
        );

        return { ...errors, message: "invalid input" };
      }
    },
    login: async (_, { email, password }, { res, req }) => {
      try {
        await loginSchema.validate({ email, password }, { abortEarly: false });
        const user = await User.findOne({ email })
          .populate("owner")
          .populate("followers");

        if (!user) {
          return {
            message: "Invalid Input",
            email: "Can't find user with provided email.",
          };
        }

        if (!(await user.comparePassword(password))) {
          return {
            message: "Invalid Input",
            password: "Password does not match with provided email address.",
          };
        }

        res.cookie("cookiez", createRefreshToken(user), { httpOnly: true });

        return {
          accessToken: createAccessToken(user),
          node: user,
        };
      } catch (error) {
        throw new Error("Something went wrong");
      }
    },
    logout: async (_, args, { res }: OwnContext) => {
      sendRefreshToken(res, "");
      return true;
    },
    updateUser: async (_, { userId, name, bio, website }) => {
      try {
        await updateSchema.validate(
          { name, bio, website },
          { abortEarly: false }
        );

        await User.updateOne(
          { _id: userId },
          {
            $set: {
              name: name,
              bio: bio,
              website: website,
            },
          },
          { runValidators: true }
        );

        const user = await User.aggregate([
          { $match: { _id: { $eq: Types.ObjectId(userId) } } },
          ...userPipeline,
        ]);

        return {
          node: user[0],
        };
      } catch (error) {
        const errors = formatErrors(error.inner[0]);

        return { ...errors, message: "invalid input" };
      }
    },
    followUser: async (_, { id }, { authenticatedUser }: OwnContext) => {
      try {
        const user = await User.findById(authenticatedUser._id);

        const follow = await User.updateOne(
          { _id: id, followers: { $nin: [user!.id] } },
          { $push: { followers: user!.id } }
        );

        await User.updateOne(
          { _id: user!.id, following: { $nin: [id] } },
          { $push: { following: id! } }
        );

        if (!follow.nModified) {
          if (!follow.ok) {
            return new Error("Couldn't follow the user.");
          }
          const unfollow = await User.updateOne(
            { _id: id },
            { $pull: { followers: user!.id } }
          );

          await User.updateOne(
            { _id: user!.id },
            { $pull: { following: id! } }
          );

          if (!unfollow.nModified) {
            return new Error("Couldn't unfollow the user");
          }
        }
        const userToFollow = await User.aggregate([
          { $match: { _id: Types.ObjectId(id) } },
          ...userPipeline,
        ]);

        return {
          node: userToFollow[0],
          status: true,
        };
      } catch (error) {
        throw new Error(error);
      }
    },
    uploadAvatar: async (_, { file }, { authenticatedUser }: OwnContext) => {
      try {
        cloudinary.config({
          cloud_name: process.env.CLOUDINARY_NAME,
          api_key: process.env.CLOUDINARY_KEY,
          api_secret: process.env.CLOUDINARY_SECRET,
        });

        const { createReadStream } = await file;
        const user = await User.findById(authenticatedUser!._id);
        const eager = {
          width: 130,
          height: 130,
          crop: "scale",
          format: "png",
        };

        const result = (await new Promise((resolve, reject) => {
          createReadStream().pipe(
            cloudinary.uploader.upload_stream(
              { folder: "new-client", eager: eager },
              (error: any, result: any) => {
                if (error) {
                  reject(error);
                }
                resolve(result);
              }
            )
          );
        })) as any;

        user!.avatar = result!.secure_url;

        await user!.save();

        return {
          node: user,
          status: true,
        };
      } catch (error) {
        throw new Error(error);
      }
    },
  },
} as IResolvers;
