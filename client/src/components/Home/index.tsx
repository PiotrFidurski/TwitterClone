import * as React from "react";
import {
  PrimaryColumn,
  SidebarColumn,
  Main,
  StyledRoutesWrapper,
  BaseStylesDiv,
  SpanContainer,
} from "../../styles";
import { Switch, Redirect, Route } from "react-router-dom";
import { SecondaryColumn } from "../SecondaryColumn";
import { ProfilePage } from "../../pages/ProfilePage";
import { CommentsPage } from "../../pages/CommentsPage";
import { SideBar, Nav, Link } from "../Sidebar";
import { ReactComponent as Settings } from "../svgs/settings.svg";
import { ReactComponent as Explore } from "../svgs/explore.svg";
import { ReactComponent as Logo } from "../svgs/Logo.svg";
import { User } from "../../generated/graphql";

const defaultUser: User = {
  __typename: "User",
  id: "",
  username: "",
  name: "",
  email: "",
  bio: "",
  website: "",
  followers: [],
  following: [],
  isFollowed: false,
  followingCount: 0,
  followersCount: 0,
  avatar: null,
};

export const Home: React.FC = () => {
  return (
    <BaseStylesDiv flexGrow>
      <SideBar>
        <Nav>
          <Link path="/home">
            <Logo />
            <SpanContainer>
              <span></span>
            </SpanContainer>
          </Link>
          <Link>
            <Explore />
            <SpanContainer bold bigger marginLeft marginRight>
              <span>Explore</span>
            </SpanContainer>
          </Link>
          <Link>
            <Settings />
            <SpanContainer bold bigger marginLeft marginRight>
              <span>Settings</span>
            </SpanContainer>
          </Link>
        </Nav>
      </SideBar>
      <Main>
        <div>
          <StyledRoutesWrapper>
            <PrimaryColumn>
              <Switch>
                <Redirect exact from="/" to="/login" />
                <Redirect exact from="/settings/profile" to="/login" />
                <Redirect exact from="/home" to="/login" />
                <Route path="/user/:username">
                  <ProfilePage />
                </Route>
                <Route exact path="/:username/status/:postId">
                  <CommentsPage user={defaultUser} />
                </Route>
              </Switch>
            </PrimaryColumn>
            <SidebarColumn>
              <SecondaryColumn />
            </SidebarColumn>
          </StyledRoutesWrapper>
        </div>
      </Main>
    </BaseStylesDiv>
  );
};
