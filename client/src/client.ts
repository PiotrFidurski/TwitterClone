import { createUploadLink } from "apollo-upload-client";
import { TokenRefreshLink } from "apollo-link-token-refresh";
import jwtDecode from "jwt-decode";
import { getAccessToken, setAccessToken } from "./accessToken";
import { onError } from "@apollo/client/link/error";
import { ApolloClient, ApolloLink, from, split } from "@apollo/client";
import { getMainDefinition } from "@apollo/client/utilities";
import { Observable } from "@apollo/client/utilities/observables/Observable";
import { cache } from "./cache";
import typeDefs from "./typeDefs";
import { WebSocketLink } from "@apollo/client/link/ws";
import { AuthUserDocument } from "./generated/graphql";

cache.writeQuery({
  query: AuthUserDocument,
  data: {
    authUser: {
      __typename: "User",
      id: "",
      username: "",
      name: "",
      likes: [],
      email: "",
      bio: "",
      website: "",
      followers: [],
      following: [],
      isFollowed: false,
      followingCount: 0,
      followersCount: 0,
      avatar: null,
    },
  },
});

const uploadLink: any = createUploadLink({
  uri: "/graphql",
  credentials: "include",
});

const subscriptionUrl =
  process.env.NODE_ENV === "production"
    ? "wss://frozen-ridge-40926.herokuapp.com/graphql"
    : "ws://localhost:4000/graphql";

const wsLink = new WebSocketLink({
  uri: subscriptionUrl,
  options: {
    reconnect: true,
  },
});

const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === "OperationDefinition" &&
      definition.operation === "subscription"
    );
  },
  wsLink,
  uploadLink
);

const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors) {
    graphQLErrors.map(({ message, locations, path }) =>
      console.log(
        `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
      )
    );
  }
  if (networkError) {
    console.log(`[Network error]: ${networkError}`);
  }
});

const requestLink = new ApolloLink(
  (operation, forward): any =>
    new Observable((observer) => {
      let handle: any;
      Promise.resolve(operation)
        .then(async (operation) => {
          const accessToken = getAccessToken();
          operation.setContext({
            headers: {
              Authorization: accessToken ? `Bearer ${accessToken}` : "",
            },
          });
        })
        .then(() => {
          handle = forward(operation).subscribe({
            next: observer.next.bind(observer),
            error: observer.error.bind(observer),
            complete: observer.complete.bind(observer),
          });
        })
        .catch(observer.error.bind(observer));

      return () => {
        if (handle) handle.unsubscribe();
      };
    })
);

export const client = new ApolloClient({
  cache,
  link: from([
    new TokenRefreshLink({
      accessTokenField: "accessToken",
      isTokenValidOrUndefined: () => {
        const token = getAccessToken();

        if (!token) {
          return true;
        }
        try {
          const { exp } = jwtDecode(token);
          if (Date.now() >= exp * 1000) {
            return false;
          } else {
            return true;
          }
        } catch (error) {
          return false;
        }
      },
      fetchAccessToken: () => {
        return fetch("/refresh_token", {
          method: "POST",
          credentials: "include",
        });
      },
      handleFetch: (accessToken) => {
        setAccessToken(accessToken);
      },
      handleError: (error) => {
        console.warn(`Your refresh token is invalid. Try to relogin, ${error}`);
      },
    }),
    errorLink,
    requestLink,
    splitLink,
  ]),
  typeDefs,
});
