import { createUploadLink } from "apollo-upload-client";
import { TokenRefreshLink } from "apollo-link-token-refresh";
import jwtDecode from "jwt-decode";
import { getAccessToken, setAccessToken } from "./accessToken";
import { onError } from "@apollo/client/link/error";
import { ApolloClient, ApolloLink, from } from "@apollo/client";
import { Observable } from "@apollo/client/utilities/observables/Observable";
import { cache } from "./cache";
import typeDefs from "./typeDefs";
import {
  AuthUserDocument,
  AuthUserQuery,
  Post,
  User,
} from "./generated/graphql";

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
    uploadLink,
  ]),
  typeDefs,
  resolvers: {
    User: {
      isFollowed: (parent: User, args, { cache }) => {
        const data: AuthUserQuery = cache.readQuery({
          query: AuthUserDocument,
        });
        return (
          data &&
          data.authUser &&
          parent!.followers !== null &&
          !!parent.followers!.filter(
            (follower) => follower.id === data!.authUser.id
          ).length
        );
      },
    },
    Post: {
      isLiked: (parent: Post, args, { cache }) => {
        const data: AuthUserQuery | null = cache.readQuery({
          query: AuthUserDocument,
        });

        return !!parent!.likes!.filter((user) => user.id === data!.authUser.id)
          .length;
      },
    },
    Query: {},
    Mutation: {},
  },
});
