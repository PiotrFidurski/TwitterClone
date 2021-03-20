import "dotenv/config";
import { ApolloServer } from "apollo-server-express";
import typeDefs from "./typeDefs";
import resolvers from "./resolvers";
import AuthDirective from "./customDirectives/AuthDirective";
import { app, serverConfig, sessionMiddleware } from "./config/expressServer";
import { createServer } from "http";
import { connect } from "mongoose";
import { decode } from "jsonwebtoken";

serverConfig();

const DBURI =
  process.env.NODE_ENV !== "production"
    ? `mongodb://${process.env.DB_USERNAME}:secret@127.0.0.1:27017/api?retryWrites=true&w=majority`
    : `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.riogn.mongodb.net/api?retryWrites=true&w=majority`;

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
      if (!request!.headers!.cookie) {
        throw new Error("Not Authorized.");
      }
      const token: any = decode(
        request!.headers!.cookie!.replace("cookiez=", ""),
        {}
      );

      return new Promise((res) =>
        sessionMiddleware(ws.upgradeReq, {} as any, () => {
          res({ req: ws.upgradeReq, userId: token._id });
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
