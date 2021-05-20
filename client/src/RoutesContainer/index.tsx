import { useRefreshToken } from "../hooks/useRefreshToken";
import { LoadingPage } from "../pages/LoadingPage";
import { BaseStylesDiv } from "../styles";
import { Routes } from "./Routes";

export const RoutesContainer = () => {
  const appLoading = useRefreshToken();

  if (appLoading) {
    return <LoadingPage />;
  }

  return (
    <BaseStylesDiv flexGrow>
      <Routes />
    </BaseStylesDiv>
  );
};
