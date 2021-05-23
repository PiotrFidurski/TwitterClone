import * as React from "react";
import { SpanContainer, BaseStylesDiv, StyledAvatar } from "../../../styles";
import { AvatarContainer, ButtonContainer } from "../../../styles";
import format from "date-fns/format";
import {
  MessageUserMutation,
  useFollowUserMutation,
  User,
  MessageUserSuccess,
  UserTweetsDocument,
  UserTweetsAndRepliesDocument,
  UserLikedTweetsDocument,
  AuthUserDocument,
  AuthUserQuery,
} from "../../../generated/graphql";
import { ReactComponent as Message } from "../../../components/svgs/Messages.svg";
import { useHistory, useLocation } from "react-router-dom";
import { StyledLink } from "../../../styles";
import { MessageUserDocument } from "../../../generated/introspection-result";
import { useApolloClient, useMutation, useQuery } from "@apollo/client";
import { useModal } from "../../../components/context/ModalContext";
import { StyledContainer, StyledHeaderContainer } from "../styles";
import { ProfileTweetsWrapper } from "./ProfileTweetsWrapper";

interface Props {
  user: User;
}

export const tabsData = [
  {
    title: "Tweets",
    body: (
      <ProfileTweetsWrapper document={UserTweetsDocument} type="userTweets" />
    ),
  },
  {
    title: "Tweets & Replies",
    body: (
      <ProfileTweetsWrapper
        document={UserTweetsAndRepliesDocument}
        type="userTweetsAndReplies"
      />
    ),
  },
  {
    title: "Media",
    body: (
      <ProfileTweetsWrapper document={UserTweetsDocument} type="userTweets" />
    ),
  },
  {
    title: "Likes",
    body: (
      <ProfileTweetsWrapper
        document={UserLikedTweetsDocument}
        type="userLikedTweets"
      />
    ),
  },
];

export const Profile: React.FC<Props> = ({ user }) => {
  let location = useLocation();

  const { openModal, setOpen } = useModal();

  const [message] = useMutation<MessageUserMutation>(MessageUserDocument, {
    variables: { userId: user!.id },
  });

  const history = useHistory();

  const { cache } = useApolloClient();

  const { data } = useQuery<AuthUserQuery>(AuthUserDocument);

  const [followUser] = useFollowUserMutation({
    variables: { userId: user!.id! },
    optimisticResponse: {
      __typename: "Mutation",
      followUser: {
        __typename: "UpdateResourceResponse",
        node: {
          ...user,
          isFollowed: !user.isFollowed,
        },
      },
    },
  });

  const startMessage = async () => {
    try {
      const res = await message();
      const data = res.data?.messageUser as MessageUserSuccess;

      cache.modify({
        fields: {
          userInbox(
            cachedEntries = {
              __typename: "UserinboxResult",
              conversations: [],
              users: [],
            },
            { toReference }
          ) {
            const newRef = toReference(data!.node!.id);
            const userRef = toReference(user.id);

            if (
              cachedEntries.conversations.some(
                (ref: any) => ref!.__ref === newRef?.__ref
              )
            ) {
              return cachedEntries;
            }
            return {
              ...cachedEntries,
              conversations: [newRef, ...cachedEntries!.conversations],
              users: [userRef, ...cachedEntries!.users],
            };
          },
        },
      });
      history.push(`/messages/${data?.node?.conversationId}`);
    } catch (error) {
      throw new Error(error);
    }
  };

  const handleMessageUser = (e: React.BaseSyntheticEvent) => {
    e.stopPropagation();
    if (data?.authUser.name === "") {
      openModal("loginAlert", { closeModal: setOpen });
      return;
    }
    startMessage();
  };

  const handleFollowUser = (e: React.BaseSyntheticEvent) => {
    e.stopPropagation();
    if (data?.authUser.name === "") {
      openModal("loginAlert", { closeModal: setOpen });
      return;
    }
    followUser();
  };

  return (
    <>
      <StyledHeaderContainer>
        <AvatarContainer
          width={134}
          height="134px"
          borderColor
          borderWidth
          noRightMargin
        >
          <StyledAvatar url={user.avatar!} />
        </AvatarContainer>

        {data?.authUser?.id === user.id ? (
          <StyledLink
            style={{ flexGrow: 0 }}
            to={{
              pathname: `/settings/profile`,
              state: {
                isModalLocaction: location,
                user,
              },
            }}
          >
            <ButtonContainer>
              <div>
                <SpanContainer>
                  <span>Edit Profile</span>
                </SpanContainer>
              </div>
            </ButtonContainer>
          </StyledLink>
        ) : (
          <BaseStylesDiv style={{ minHeight: "40px" }}>
            <BaseStylesDiv>
              <ButtonContainer
                onClick={handleMessageUser}
                noMarginLeft
                noPadding
                style={{ minWidth: "40px" }}
              >
                <div>
                  <Message fill="var(--colors-button)" />
                </div>
              </ButtonContainer>
            </BaseStylesDiv>
            <BaseStylesDiv>
              <ButtonContainer
                isFollowed={!!user.isFollowed}
                onClick={handleFollowUser}
                filledVariant={!!user.isFollowed}
              >
                <div>
                  <SpanContainer>
                    <span></span>
                  </SpanContainer>
                </div>
              </ButtonContainer>
            </BaseStylesDiv>
          </BaseStylesDiv>
        )}
      </StyledHeaderContainer>

      <BaseStylesDiv>
        <StyledContainer
          style={{
            flexDirection: "column",
            alignItems: "start",
          }}
        >
          <SpanContainer bolder bigger>
            <span>{user.name}</span>
          </SpanContainer>
          <SpanContainer grey style={{ margin: "10px 0" }}>
            <span>@{user.username}</span>
          </SpanContainer>
          {user!.bio && (
            <SpanContainer
              breakSpaces
              style={{
                maxWidth: "-webkit-fill-available",
                marginBottom: "10px",
              }}
            >
              <span>{user!.bio}</span>
            </SpanContainer>
          )}
          <BaseStylesDiv
            style={{
              maxWidth: "-webkit-fill-available",
              flexWrap: "wrap",
            }}
          >
            <SpanContainer grey breakSpaces marginRight={!!user.website}>
              <span>{user.website}</span>
            </SpanContainer>

            <SpanContainer grey>
              <span>
                Joined{" "}
                {format(
                  new Date(
                    parseInt(user!.id.toString().substring(0, 8), 16) * 1000
                  ),
                  "MMM dd, yyyy",
                  {}
                )}
              </span>
            </SpanContainer>
          </BaseStylesDiv>
          <BaseStylesDiv style={{ marginTop: "10px" }}>
            <SpanContainer bold marginRight>
              <span>{user.followingCount}</span>
            </SpanContainer>
            <SpanContainer grey style={{ marginRight: "15px" }}>
              <span>Following</span>
            </SpanContainer>
            <SpanContainer bold marginRight>
              <span>{user.followersCount}</span>
            </SpanContainer>
            <SpanContainer grey>
              <span>Followers</span>
            </SpanContainer>
          </BaseStylesDiv>
        </StyledContainer>
      </BaseStylesDiv>
    </>
  );
};
