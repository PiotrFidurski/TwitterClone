import "dotenv/config";
import { ApolloServer } from "apollo-server-express";
import { typeDefs } from "./typeDefs";
import resolvers from "./resolvers";
import AuthDirective from "./customDirectives/AuthDirective";
import { app, serverConfig, sessionMiddleware } from "./config/expressServer";
import { createServer } from "http";
import { connect } from "mongoose";
import { RedisPubSub } from "graphql-redis-subscriptions";
import Redis from "ioredis";
import { decode } from "jsonwebtoken";

serverConfig();

const subscriber = new Redis({
  host: `${process.env.REDIS_HOST}`,
  port: 18964,
  password: process.env.REDIS_PASSWORD,
  username: process.env.REDIS_USERNAME,
  retryStrategy: (options: any) => Math.max(options.attempt * 100, 3000),
});
const publisher = new Redis({
  host: `${process.env.REDIS_HOST}`,
  port: 18964,
  password: process.env.REDIS_PASSWORD,
  username: process.env.REDIS_USERNAME,
  retryStrategy: (options: any) => Math.max(options.attempt * 100, 3000),
});

export const redisPubSub = new RedisPubSub({
  subscriber,
  publisher,
});

const DBURI =
  process.env.NODE_ENV === "production"
    ? `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.riogn.mongodb.net/api?retryWrites=true&w=majority`
    : `mongodb://Chimson:secret@127.0.0.1:27017/api`;

const PORT = process.env.PORT || 4000;

(async () => {
  await connect(
    DBURI,
    {
      useNewUrlParser: true,
      useCreateIndex: true,
      useUnifiedTopology: true,
      useFindAndModify: true,
    },
    (error) => {
      if (error) {
        console.log(`connecting to DB failed, ${error}`);
      } else {
        console.log("connecting to DB succeeded");
      }
    }
  );
})();

const apolloServer = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req, res, connection }) => ({ req, res, connection }),
  subscriptions: {
    onConnect: (_, ws: any, { request }) => {
      const cookie = request.headers.cookie;
      const token = cookie!.replace("cookiez=", "");

      const userId: any = decode(token, { json: true });

      return new Promise((res) =>
        sessionMiddleware(ws.upgradeReq, {} as any, () => {
          res({ req: ws.upgradeReq, userId: userId._id });
        })
      );
    },
  },
  schemaDirectives: {
    auth: AuthDirective,
  },
});

apolloServer.applyMiddleware({ app, cors: false });

const httpServer = createServer(app);

apolloServer.installSubscriptionHandlers(httpServer);

httpServer.listen(PORT, () => {
  console.log("Express server started");
  console.log(
    `Subscriptions ready at ws://localhost:${PORT}${apolloServer.subscriptionsPath}`
  );
});
