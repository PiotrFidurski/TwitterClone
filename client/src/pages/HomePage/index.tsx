import * as React from "react";
import { BaseStylesDiv, Main, Spinner } from "../../styles";
import {
  User,
  UserInboxDocument,
  UserInboxQuery,
} from "../../generated/graphql";
import { AutheticatedRoutes } from "../../RoutesContainer/Routes/AuthenticatedRoutes";
import { HomeSidebar } from "./HomeSidebar";
import { useQuery } from "@apollo/client";

interface Props {
  user: User;
}

const HomePage: React.FC<Props> = ({ user }) => {
  const inbox = useQuery<UserInboxQuery, any>(UserInboxDocument);

  if (inbox.loading && !inbox.data) return <Spinner />;

  const { userInbox } = inbox!.data!;

  return (
    <BaseStylesDiv flexGrow>
      <HomeSidebar
        user={user}
        inbox={userInbox!}
        subscribeToMore={inbox.subscribeToMore}
      />
      <Main>
        <div>
          <AutheticatedRoutes user={user} userInbox={inbox} />
        </div>
      </Main>
    </BaseStylesDiv>
  );
};

export default HomePage;
