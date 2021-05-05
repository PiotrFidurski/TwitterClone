import * as React from "react";
import {
  PrimaryColumn,
  Main,
  StyledRoutesWrapper,
  BaseStylesDiv,
  SpanContainer,
  HoverContainer,
  Absolute,
} from "../../styles";
import { ReactComponent as Brush } from "../../components/svgs/brush.svg";
import { ReactComponent as Display } from "../../components/svgs/display.svg";
import { Switch, Redirect, Route, useLocation } from "react-router-dom";
import { ProfilePage } from "../../pages/ProfilePage";
import { CommentsPage } from "../../pages/CommentsPage";
import { SideBar, Nav, Link } from "../Sidebar";
import { ReactComponent as Settings } from "../svgs/settings.svg";
import { ReactComponent as Explore } from "../svgs/explore.svg";
import { ReactComponent as Logo } from "../svgs/Logo.svg";
import { User } from "../../generated/graphql";
import { NavLink } from "../Sidebar/styles";

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
  const location = useLocation<{ isModalLocaction: any }>();
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
          <NavLink
            style={{ textDecoration: "none" }}
            to={{
              pathname: "/i/display",
              state: {
                ...location.state,
                isModalLocaction: location,
              },
            }}
          >
            <HoverContainer>
              <Absolute noMargin />
              <BaseStylesDiv>
                <Display fill="var(--colors-button)" height="1.75em" />
                <Brush
                  height="1.75em"
                  style={{ position: "absolute" }}
                  fill="var(--colors-button)"
                />
              </BaseStylesDiv>
              <SpanContainer bold bigger marginLeft marginRight>
                <span>Display</span>
              </SpanContainer>
            </HoverContainer>
          </NavLink>
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
                <Redirect exact from="/messages" to="/login" />
                <Redirect exact from="/messages/*" to="/login" />
                <Route path="/user/:username">
                  <ProfilePage user={defaultUser} />
                </Route>
                <Route exact path="/:username/status/:tweetId">
                  <CommentsPage user={defaultUser} />
                </Route>
              </Switch>
            </PrimaryColumn>
          </StyledRoutesWrapper>
        </div>
      </Main>
    </BaseStylesDiv>
  );
};
