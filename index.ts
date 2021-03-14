import "dotenv/config";
import { ApolloServer } from "apollo-server-express";
import typeDefs from "./typeDefs";
import resolvers from "./resolvers";
import AuthDirective from "./customDirectives/AuthDirective";
import { app, serverConfig } from "./config/expressServer";
import { createServer } from "http";
import { connect } from "mongoose";

const PORT = process.env.PORT || 4000;

(async () => {
  serverConfig();

  await connect(
    `mongodb://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@localhost:27017/api`,
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

  const apolloServer = new ApolloServer({
    typeDefs,
    resolvers,
    schemaDirectives: {
      auth: AuthDirective,
    },
    context: ({ req, res }) => ({ req, res }),
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
})();