import * as React from "react";
import { BaseStylesDiv, Main } from "../../styles";
import { User } from "../../generated/graphql";
import { AutheticatedRoutes } from "../../RoutesContainer/Routes/AuthenticatedRoutes";
import { HomeSidebar } from "./HomeSidebar";

interface Props {
  user: User;
}

const HomePage: React.FC<Props> = ({ user }) => {
  return (
    <BaseStylesDiv flexGrow>
      <HomeSidebar user={user} />
      <Main>
        <div>
          <AutheticatedRoutes user={user} />
        </div>
      </Main>
    </BaseStylesDiv>
  );
};

export default HomePage;
