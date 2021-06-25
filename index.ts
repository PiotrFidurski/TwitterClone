import { ApolloServer } from "apollo-server-express";
import "dotenv/config";
import { createServer } from "http";
import { decode } from "jsonwebtoken";
import { connect } from "mongoose";
import { app, serverConfig, sessionMiddleware } from "./config/expressServer";
import AuthDirective from "./customDirectives/AuthDirective";
import resolvers from "./resolvers";
import typeDefs from "./typeDefs";

serverConfig();

const DBURI =
  process.env.NODE_ENV === "production"
    ? `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.riogn.mongodb.net/api?retryWrites=true&w=majority`
    : `mongodb://${process.env.DB_LOCAL_USERNAME}:${process.env.DB_LOCAL_PASSWORD}@127.0.0.1:27017/${process.env.DB_LOCAL_NAME}`;

const PORT = process.env.PORT || 4000;

(async () => {
  await connect(
    DBURI,
    {
      useNewUrlParser: true,
      useCreateIndex: true,
      useUnifiedTopology: true,
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
