import * as React from "react";
import { setAccessToken } from "../accessToken";

export const useRefreshToken = () => {
  const [isAppLoading, setIsAppLoading] = React.useState(true);

  React.useEffect(() => {
    fetch("/refresh_token", {
      method: "POST",
      credentials: "include",
    }).then(async (response) => {
      const data = await response.json();
      setAccessToken(data.accessToken);
      setIsAppLoading(false);
    });
  }, []);

  return isAppLoading;
};
