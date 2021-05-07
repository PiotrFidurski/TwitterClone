import * as React from "react";
import { User, UserInboxQueryResult } from "../../generated/graphql";
import { Feed } from "../../components/Feed";
import { StyledRoutesWrapper } from "../../styles";
import { Switch, Redirect, Route, useLocation } from "react-router-dom";
import { CreateTweetModal } from "../../components/Modals/CreateTweetModal";
import { EditProfileModal } from "../../components/Modals/EditProfileModal";
import { ProfilePage } from "../../pages/ProfilePage";
import { CommentsPage } from "../../pages/CommentsPage";
import { CustomizeViewModal } from "../../components/Modals/CustomizeViewModal";
import { MessagesPage } from "../../pages/MessagesPage";

interface Props {
  user: User;
  userInbox: UserInboxQueryResult;
}

export const AutheticatedRoutes: React.FC<Props> = ({ user, userInbox }) => {
  let location = useLocation<{ isModalLocaction: any }>();

  return (
    <StyledRoutesWrapper>
      <Switch location={location.state?.isModalLocaction || location}>
        <Redirect exact from="/" to="/home" />
        <Redirect exact from="/login" to="/home" />
        <Redirect exact from="/register" to="/home" />
        <Route exact path="/home">
          <Feed user={user} />
        </Route>
        <Route path="/user/:username">
          <ProfilePage user={user} />
        </Route>
        <Route path="/:username/status/:tweetId">
          <CommentsPage user={user} />
        </Route>
        <Route path="/messages">
          <MessagesPage user={user} userInbox={userInbox} />
        </Route>
        <Route exact path="/tweets/compose">
          <CreateTweetModal />
        </Route>
        <Route exact path="/settings/profile">
          <EditProfileModal />
        </Route>
        <Route exact path="/i/display">
          <CustomizeViewModal />
        </Route>
      </Switch>
    </StyledRoutesWrapper>
  );
};

export default AutheticatedRoutes;
