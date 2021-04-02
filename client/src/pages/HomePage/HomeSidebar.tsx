import * as React from "react";
import { useLocation } from "react-router-dom";
import { StyledDropDownItem } from "../../components/DropDown/DropDownComposition/Menu";
import { ReactComponent as Home } from "../../components/svgs/Home.svg";
import { SideBar, Link, Nav } from "../../components/Sidebar";
import { ReactComponent as Bell } from "../../components/svgs/Bell.svg";
import { ReactComponent as Settings } from "../../components/svgs/settings.svg";
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
  User,
} from "../../generated/graphql";
import {
  SpanContainer,
  AvatarContainer,
  StyledAvatar,
  HoverContainer,
  Absolute,
  BaseStylesDiv,
  ButtonContainer,
  BaseStyles,
} from "../../styles";
import { NavLink } from "../../components/Sidebar/styles";
import { Location } from "history";
import { DropdownProvider } from "../../components/DropDown";
import styled from "styled-components";
import { useApolloClient, useSubscription } from "@apollo/client";
import { UserInboxQueryResult } from "../../generated/introspection-result";

const StyledNotification = styled.div`
  ${BaseStyles};
  position: absolute;
  top: 3px;
  display: flex !important;
  justify-content: center;
  text-align: center;
  border-radius: 9999px;
  height: 20px;
  width: 20px;
  font-size: 11px;
  align-items: center;
  box-shadow: 0px 1px 0px 1px #15202b;
  color: white;
  left: 28px;
  background-color: var(--colors-button);
  right: 0px;
`;

interface Props {
  user: User;
  userInbox: UserInboxQueryResult;
}

export const HomeSidebar: React.FC<Props> = ({ user, userInbox }) => {
  const { data, loading, subscribeToMore } = userInbox;
  const location = useLocation<{ isModal: Location }>();

  useSubscription<ConversationUpdatedSubscription>(
    ConversationUpdatedDocument,
    { variables: { userId: user!.id! } }
  );
  const { cache } = useApolloClient();

  const notifications =
    !loading &&
    data &&
    data!.userInbox &&
    data!.userInbox
      .map((conversation) => {
        const lastSeenId = conversation!.participants!.filter(
          (participant) => participant.userId === user.id
        )[0].lastSeenMessageId;

        return lastSeenId !== conversation!.mostRecentEntryId! ||
          lastSeenId === ""
          ? {
              [conversation.conversationId!]:
                lastSeenId !== conversation.mostRecentEntryId,
            }
          : null;
      })
      .filter((value) => value !== null);

  React.useEffect(() => {
    let unsubscribe: any;

    unsubscribe = subscribeToMore({
      document: ConversationUpdatedDocument,
      variables: { userId: user!.id! },
      updateQuery: (prev: any, { subscriptionData }: any) => {
        if (!subscriptionData.data) return prev;
        console.log(subscriptionData!.data!);
        cache.modify({
          fields: {
            userInbox(cachedEntries, { toReference, readField }) {
              // return cachedEntries!.filter((conversation: any) => {
              //   if (
              //     conversation!.__ref ===
              //     subscriptionData!.data!.conversationUpdated!.conversation!.id
              //   ) {
              //     const ref = toReference(conversation);
              //     const messages_conversation: any = readField(
              //       "messages_conversation",
              //       ref
              //     );
              //     const newItemRef = toReference(
              //       subscriptionData!.data!.conversationUpdated!.conversation
              //     );
              //     return {
              //       ...conversation,
              //       messages_conversation: [...messages_conversation]!.splice(
              //         0,
              //         1,
              //         newItemRef
              //       ),
              //     };
              //   }
              //   return conversation;
              // });
            },
            conversationMessages(cachedEntries, { toReference }) {
              if (
                cachedEntries.conversation.__ref ===
                subscriptionData!.data!.conversationUpdated!.conversation!.id
              ) {
                return {
                  ...cachedEntries,
                  messages: [
                    ...cachedEntries.messages,
                    subscriptionData!.data!.conversationUpdated!.message,
                  ],
                };
              }
            },
          },
        });
      },
    });
    if (unsubscribe) return () => unsubscribe();
  }, [cache, subscribeToMore, user]);

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
        <Link path="/messages">
          <Messages />
          {notifications && notifications.length > 0 ? (
            <StyledNotification>{notifications.length}</StyledNotification>
          ) : null}
          <SpanContainer bold bigger marginLeft marginRight>
            <span>Messages</span>
          </SpanContainer>
        </Link>
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
        <DropdownProvider position="fixed">
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
          <DropdownProvider.Menu>
            <BaseStylesDiv>
              <BaseStylesDiv flexColumn>
                <NavLink
                  style={{ textDecoration: "none" }}
                  to={{
                    pathname: "/i/display",
                    state: {
                      ...location.state,
                      isModalLoc: location,
                    },
                  }}
                >
                  <StyledDropDownItem>
                    <Display />
                    <Brush style={{ position: "absolute" }} />
                    <SpanContainer color="white">
                      <span>Display</span>
                    </SpanContainer>
                  </StyledDropDownItem>
                </NavLink>
                <StyledDropDownItem>
                  <Lists />
                  <SpanContainer color="white">
                    <span>Keyboard shortcuts</span>
                  </SpanContainer>
                </StyledDropDownItem>
                <StyledDropDownItem>
                  <Settings />
                  <SpanContainer color="white">
                    <span>Settings and privacy</span>
                  </SpanContainer>
                </StyledDropDownItem>
              </BaseStylesDiv>
            </BaseStylesDiv>
          </DropdownProvider.Menu>
        </DropdownProvider>
        <NavLink
          to={{
            pathname: "/posts/compose",
            state: {
              ...location.state,
              isModalLoc: location,
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
