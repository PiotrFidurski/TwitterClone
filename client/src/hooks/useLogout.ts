import {
  useLogoutMutation,
  AuthUserQuery,
  AuthUserDocument,
} from "../generated/graphql";
import { useApolloClient } from "@apollo/client";
import { setAccessToken } from "../accessToken";
import { useHistory } from "react-router";

export const useLogout = () => {
  const { push } = useHistory();
  const { resetStore } = useApolloClient();
  const [logout] = useLogoutMutation();

  const handleLogOut = () => {
    logout({
      update: (store) => {
        store.writeQuery<AuthUserQuery>({
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
    resetStore();
    push("/login");
  };

  return handleLogOut;
};
