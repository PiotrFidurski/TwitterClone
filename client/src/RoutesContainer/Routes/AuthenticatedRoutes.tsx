import * as React from "react";
import { User } from "../../generated/graphql";
import { Feed } from "../../components/Feed";
import {
  PrimaryColumn,
  SidebarColumn,
  StyledRoutesWrapper,
} from "../../styles";
import { Switch, Redirect, Route, useLocation } from "react-router-dom";
import { SecondaryColumn } from "../../components/SecondaryColumn";
import { CreatePostModal } from "../../components/Modals/CreatePostModal";
import { EditProfileModal } from "../../components/Modals/EditProfileModal";
import { ProfilePage } from "../../pages/ProfilePage";
import { CommentsPage } from "../../pages/CommentsPage";
import { CustomizeViewModal } from "../../components/Modals/CustomizeViewModal";

interface Props {
  user: User;
  postId?: string;
}

export const AutheticatedRoutes: React.FC<Props> = ({ user }) => {
  let location: any = useLocation();

  let isModalLoc = location.state && location.state.isModalLoc;

  return (
    <StyledRoutesWrapper>
      <PrimaryColumn>
        <Switch location={isModalLoc || location}>
          <Redirect exact from="/login" to="/home" />
          <Redirect exact from="/register" to="/home" />
          <Redirect exact from="/" to="/home" />
          <Route exact path="/home">
            <Feed user={user} />
          </Route>
          <Route path="/user/:username">
            <ProfilePage />
          </Route>
          <Route path="/:username/status/:postId">
            <CommentsPage user={user} />
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
        </Switch>
      </PrimaryColumn>
      <SidebarColumn>
        <SecondaryColumn user={user} />
      </SidebarColumn>
    </StyledRoutesWrapper>
  );
};

export default AutheticatedRoutes;
