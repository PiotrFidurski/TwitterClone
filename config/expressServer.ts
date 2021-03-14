import express from "express";
import cors from "cors";
import { verify } from "jsonwebtoken";
import {
  createRefreshToken,
  sendRefreshToken,
  createAccessToken,
} from "../utilities/auth";
import compression from "compression";
import path from "path";
import cookieParser from "cookie-parser";
import User from "../entity/User";

export const app = express();

export const serverConfig = () => {
  app.use(cors(), cookieParser());

  if (process.env.NODE_ENV === "production") {
    app.use(compression());
    app.use(express.static(path.join(__dirname, "client/build")));

    app.get("*", function (req, res) {
      res.sendFile(path.join(__dirname, "client/build", "index.html"));
    });
  }

  app.post("/refresh_token", async (req, res) => {
    const token = req.cookies.cookiez;

    if (!token) {
      return res.send({ ok: false, accessToken: "" });
    }
    let payload: any = null;
    try {
      payload = verify(token, process.env.REFRESH_TOKEN_SECRET!);
    } catch (error) {
      return res.send({ ok: false, accessToken: "" });
    }

    const user = await User.findById(payload._id);

    if (!user) {
      return res.send({ ok: false, accessToken: "" });
    }

    if (user.tokenVersion !== payload.tokenVersion) {
      return res.send({ ok: false, accessToken: "" });
    }

    sendRefreshToken(res, createRefreshToken(user));

    return res.send({ ok: true, accessToken: createAccessToken(user) });
  });
};
