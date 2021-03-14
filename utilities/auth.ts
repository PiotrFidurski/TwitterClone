import User, { IUser } from "../entity/User";
import { sign, verify } from "jsonwebtoken";
import { Response } from "express";
import { OwnContext } from "src/types";

export const createAccessToken = (user: IUser) => {
  return sign({ _id: user.id }, process.env.ACCESS_TOKEN_SECRET!, {
    expiresIn: "500m",
  });
};

export const createRefreshToken = (user: IUser) => {
  return sign(
    { _id: user.id, tokenVersion: user.tokenVersion },
    process.env.REFRESH_TOKEN_SECRET!,
    {
      expiresIn: "7d",
    }
  );
};

export const sendRefreshToken = (res: Response, token: string) => {
  res.cookie("cookiez", token, { httpOnly: true, path: "refresh_token" });
};

export const revokeRefreshTokens = async (user: IUser) => {
  return await User.findOneAndUpdate(
    { _id: user.id },
    { $inc: { tokenVersion: 1 } }
  ).exec(function (error) {
    console.log(error);
  });
};

export const authenticate = ({ req }: OwnContext) => {
  const authorization = req.header("Authorization") || "";

  if (authorization) {
    const token = authorization.replace("Bearer ", "");
    const secret = process.env.ACCESS_TOKEN_SECRET;
    try {
      if (!secret) {
        throw new Error("Secret not provided.");
      }
      return verify(token, secret);
    } catch (error) {
      throw new Error("Invalid Token");
    }
  }
  throw new Error("Not authorized to view this resource.");
};
