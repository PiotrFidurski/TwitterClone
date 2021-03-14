import { Response, Request } from "express";
import { Document } from "mongoose";

export interface OwnContext {
  req: Request;
  res: Response;
  authenticatedUser: IAuth;
}

interface IAuth extends Document {
  _id: string;
}
