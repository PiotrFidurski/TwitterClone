import * as React from "react";
import { useLocation } from "react-router-dom";
import { StyledDropDownItem } from "../../components/DropDown/DropDownComposition/styles";
import { ReactComponent as Home } from "../../components/svgs/Home.svg";
import { SideBar, Link, Nav } from "../../components/Sidebar";
import { ReactComponent as Bell } from "../../components/svgs/Bell.svg";
import { ReactComponent as Settings } from "../../components/svgs/settings.svg";
import { ReactComponent as Logout } from "../../components/svgs/followminus.svg";
import { ReactComponent as More } from "../../components/svgs/More.svg";
import { ReactComponent as Messages } from "../../components/svgs/Messages.svg";
import { ReactComponent as Bookmarks } from "../../components/svgs/Bookmarks.svg";
import { ReactComponent as Brush } from "../../components/svgs/brush.svg";
import { ReactComponent as Display } from "../../components/svgs/display.svg";
import { ReactComponent as Lists } from "../../components/svgs/Lists.svg";
import { ReactComponent as Feather } from "../../components/svgs/Feather.svg";
import { ReactComponent as Logo } from "../../components/svgs/Logo.svg";
import {
  ConversationUpdatedDocument,
  ConversationUpdatedSubscription,
  Exact,
  User,
  UserInboxQuery,
  UserinboxResult,
} from "../../generated/graphql";
import {
  SpanContainer,
  AvatarContainer,
  StyledAvatar,
  HoverContainer,
  Absolute,
  BaseStylesDiv,
  ButtonContainer,
} from "../../styles";
import { NavLink, StyledNotification } from "../../components/Sidebar/styles";
import { Location } from "history";
import { DropdownProvider } from "../../components/DropDown/context";
import {
  SubscribeToMoreOptions,
  useApolloClient,
  useSubscription,
} from "@apollo/client";
import { useMarkMessagesAsSeen } from "../../hooks/useMarkMessagesAsSeen";
import { useLogout } from "../../hooks/useLogout";
import { inboxSubscription } from "./inboxSubscription";
import { useConversationNotifications } from "./useConversationNotifications";
import { sidebarReducer } from "../../components/DropDown/reducers";

interface Props {
  user: User;
  inbox: UserinboxResult;
  subscribeToMore: <
    TSubscriptionData = UserInboxQuery,
    TSubscriptionVariables = Exact<{
      [key: string]: never;
    }>
  >(
    options: SubscribeToMoreOptions<
      UserInboxQuery,
      TSubscriptionVariables,
      TSubscriptionData
    >
  ) => () => void;
}

export const HomeSidebar: React.FC<Props> = ({ ...props }) => {
  const { user, subscribeToMore, inbox } = props;

  const { conversations, lastSeenMessageId } = inbox!;

  const logout = useLogout();

  const location = useLocation<{ isModal: Location }>();

  const { cache } = useApolloClient();

  const updateSeenMessages = useMarkMessagesAsSeen(conversations!);

  useSubscription<ConversationUpdatedSubscription>(
    ConversationUpdatedDocument,
    { variables: { userId: user!.id! } }
  );

  const [count] = useConversationNotifications(
    lastSeenMessageId!,
    conversations!
  );

  React.useEffect(() => {
    let unsubscribe: any;

    unsubscribe = subscribeToMore(inboxSubscription(cache, user));
    if (unsubscribe) return () => unsubscribe();
  }, [subscribeToMore, cache, user]);

  return (
    <SideBar>
      <Nav>
        <Link path="/home">
          <Logo width="1.75em" height="1.75em" />
          <SpanContainer>
            <span></span>
          </SpanContainer>
        </Link>
        <Link path="/home">
          <Home />
          <SpanContainer bold bigger marginLeft marginRight>
            <span>Home</span>
          </SpanContainer>
        </Link>
        <Link>
          <Bell />
          <SpanContainer bold bigger marginLeft marginRight>
            <span>Notifications</span>
          </SpanContainer>
        </Link>
        <div onClick={updateSeenMessages}>
          <Link path="/messages">
            <Messages />
            {count > 0 ? (
              <StyledNotification>{count}</StyledNotification>
            ) : null}
            <SpanContainer bold bigger marginLeft marginRight>
              <span>Messages</span>
            </SpanContainer>
          </Link>
        </div>
        <Link>
          <Bookmarks />
          <SpanContainer bold bigger marginLeft marginRight>
            <span>Bookmarks</span>
          </SpanContainer>
        </Link>
        <Link>
          <Lists />
          <SpanContainer bold bigger marginLeft marginRight>
            <span>Lists</span>
          </SpanContainer>
        </Link>
        <Link>
          <Bell />
          <SpanContainer bold bigger marginLeft marginRight>
            <span>Notifications</span>
          </SpanContainer>
        </Link>
        <Link path={`/user/${user!.username}`}>
          <AvatarContainer noRightMargin width={30} height="30px">
            <StyledAvatar url={user!.avatar!} />
          </AvatarContainer>
          <SpanContainer bold bigger marginLeft marginRight>
            Profile
          </SpanContainer>
        </Link>
        <DropdownProvider reducer={sidebarReducer}>
          <DropdownProvider.Toggle>
            <BaseStylesDiv>
              <HoverContainer style={{ padding: "10px" }}>
                <Absolute noMargin />
                <More />
                <div>
                  <SpanContainer bold bigger marginLeft marginRight>
                    <span>More</span>
                  </SpanContainer>
                </div>
              </HoverContainer>
            </BaseStylesDiv>
          </DropdownProvider.Toggle>
          <DropdownProvider.Menu position="fixed">
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
              <StyledDropDownItem>
                <Display />
                <Brush style={{ position: "absolute" }} />
                <SpanContainer>
                  <span>Display</span>
                </SpanContainer>
              </StyledDropDownItem>
            </NavLink>
            <StyledDropDownItem>
              <Lists />
              <SpanContainer>
                <span>Keyboard shortcuts</span>
              </SpanContainer>
            </StyledDropDownItem>
            <StyledDropDownItem>
              <Settings />
              <SpanContainer>
                <span>Settings and privacy</span>
              </SpanContainer>
            </StyledDropDownItem>
            <StyledDropDownItem danger onClick={logout}>
              <Logout />
              <SpanContainer>
                <span>Log Out @{user.username}</span>
              </SpanContainer>
            </StyledDropDownItem>
          </DropdownProvider.Menu>
        </DropdownProvider>
        <NavLink
          to={{
            pathname: "/posts/compose",
            state: {
              ...location.state,
              isModalLocaction: location,
            },
          }}
        >
          <BaseStylesDiv flexGrow style={{ paddingTop: "10px" }}>
            <ButtonContainer filledVariant noMarginLeft bigger>
              <div>
                <Feather />
                <SpanContainer>
                  <span>Tweet</span>
                </SpanContainer>
              </div>
            </ButtonContainer>
          </BaseStylesDiv>
        </NavLink>
      </Nav>
    </SideBar>
  );
};
