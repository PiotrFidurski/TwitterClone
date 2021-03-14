import "dotenv/config";
import { ApolloServer } from "apollo-server-express";
import typeDefs from "./typeDefs";
import resolvers from "./resolvers";
import AuthDirective from "./customDirectives/AuthDirective";
import { app, serverConfig } from "./config/expressServer";
import { createServer } from "http";
import { connect } from "mongoose";

serverConfig();

const PORT = process.env.PORT || 4000;

(async () => {
  await connect(
    `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.riogn.mongodb.net/api?retryWrites=true&w=majority`,
    {
      useNewUrlParser: true,
      useCreateIndex: true,
      useUnifiedTopology: true,
    },
    (error) => {
      if (error) {
        throw new Error(error);
      } else {
        console.log("connecting to DB succeeded");
      }
    }
  );
})();

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
