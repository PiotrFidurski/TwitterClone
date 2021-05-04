import {
  useLogoutMutation,
  AuthUserQuery,
  AuthUserDocument,
} from "../generated/graphql";
import { setAccessToken } from "../accessToken";
import { useApolloClient } from "@apollo/client";

export const useLogout = () => {
  const [logout] = useLogoutMutation();
  const { clearStore } = useApolloClient();
  const handleLogOut = () => {
    logout({
      update: (cache) => {
        cache.writeQuery<AuthUserQuery>({
          query: AuthUserDocument,
          data: {
            authUser: {
              email: "",
              followers: [],
              id: "2",
              username: "",
              name: "",
              avatar: "",
              bio: "",
              website: "",
              isFollowed: false,
              followersCount: 0,
              followingCount: 0,
              __typename: "User",
            },
          },
        });
      },
    });

    setAccessToken("");
    clearStore();
  };

  return handleLogOut;
};
