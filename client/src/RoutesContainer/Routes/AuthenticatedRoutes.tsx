import * as React from "react";
import {
  User,
  UserInboxQuery,
  UserInboxQueryHookResult,
  UserInboxQueryResult,
} from "../../generated/graphql";
import { Feed } from "../../components/Feed";
import { StyledRoutesWrapper } from "../../styles";
import { Switch, Redirect, Route, useLocation } from "react-router-dom";
import { CreatePostModal } from "../../components/Modals/CreatePostModal";
import { EditProfileModal } from "../../components/Modals/EditProfileModal";
import { ProfilePage } from "../../pages/ProfilePage";
import { CommentsPage } from "../../pages/CommentsPage";
import { CustomizeViewModal } from "../../components/Modals/CustomizeViewModal";
import { CreateNewMessageModal } from "../../components/Modals/CreateNewMessageModal";
import { MessagesPage } from "../../pages/MessagesPage";

interface Props {
  user: User;
  postId?: string;
  userInbox: UserInboxQueryResult;
}

export const AutheticatedRoutes: React.FC<Props> = ({ user, userInbox }) => {
  let location: any = useLocation();

  let isModalLoc = location.state && location.state.isModalLoc;

  return (
    <StyledRoutesWrapper>
      <Switch location={isModalLoc || location}>
        <Redirect exact from="/login" to="/home" />
        <Redirect exact from="/register" to="/home" />
        <Redirect exact from="/" to="/home" />
        <Route exact path="/home">
          <Feed user={user} />
        </Route>
        <Route path="/user/:username">
          <ProfilePage user={user} />
        </Route>
        <Route path="/:username/status/:postId">
          <CommentsPage user={user} />
        </Route>
        <Route path="/messages">
          <MessagesPage user={user} userInbox={userInbox} />
        </Route>
        <Route exact path="/posts/compose">
          <CreatePostModal />
        </Route>
        <Route exact path="/settings/profile">
          <EditProfileModal />
        </Route>
        <Route exact path="/i/display">
          <CustomizeViewModal />
        </Route>
        <Route exact path="/messages/compose">
          <CreateNewMessageModal />
        </Route>
      </Switch>
    </StyledRoutesWrapper>
  );
};

export default AutheticatedRoutes;
