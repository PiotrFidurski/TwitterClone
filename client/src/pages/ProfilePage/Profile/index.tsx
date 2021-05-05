import * as React from "react";
import {
  SpanContainer,
  BaseStylesDiv,
  StyledAvatar,
  BaseStyles,
  Spinner,
  JustifyCenter,
} from "../../../styles";
import { AvatarContainer, ButtonContainer } from "../../../styles";
import * as S from "./styles";
import { Tabs } from "./Tabs";
import format from "date-fns/format";
import {
  MessageUserMutation,
  useFollowUserMutation,
  User,
  GetUserByNameQuery,
  MessageUserSuccess,
  UserTweetsQuery,
  UserTweetsDocument,
  UserTweetsAndRepliesQuery,
  UserTweetsAndRepliesDocument,
  UserLikedTweetsQuery,
  UserLikedTweetsDocument,
  AuthUserDocument,
  AuthUserQuery,
} from "../../../generated/graphql";
import { ReactComponent as Message } from "../../../components/svgs/Messages.svg";
import { useHistory, useLocation, useParams } from "react-router-dom";
import { StyledLink } from "../../../styles";
import styled from "styled-components";
import {
  MessageUserDocument,
  GetUserByNameDocument,
} from "../../../generated/introspection-result";
import { VirtualizedList } from "../../../components/VirtualizedList";
import { useApolloClient, useMutation, useQuery } from "@apollo/client";
import { useModalContext } from "../../../components/context/ModalContext";

interface Props {
  user: User;
}

const StyledHeaderContainer = styled.div`
  ${BaseStyles};
  color: white;
  flex-grow: 1;
  align-items: center;
  justify-content: space-between;
  padding: 0 15px 0 15px;
`;

const StyledContainer = styled.div`
  ${BaseStyles};
  color: white;
  padding: 0 15px 0 15px;
  width: 0px;
  flex-grow: 1;
`;

const UserTweets = () => {
  const { username } = useParams<{ username: string }>();

  const { data: userData, loading: userLoading } = useQuery<GetUserByNameQuery>(
    GetUserByNameDocument,
    {
      variables: { username },
    }
  );
  const userId =
    userData?.userByName.__typename === "UserByNameSuccess"
      ? userData.userByName.node.id
      : "";
  const { data, loading, fetchMore } = useQuery<UserTweetsQuery>(
    UserTweetsDocument,
    {
      variables: {
        userId,
      },
    }
  );

  const loadMore = async (): Promise<any> => {
    try {
      const after =
        data?.userTweets.__typename === "TweetConnection" &&
        data.userTweets.pageInfo.endCursor;
      await fetchMore({
        variables: {
          userId,
          after,
        },
      });
    } catch (error) {
      return error;
    }
  };

  if (loading || userLoading) return <Spinner />;

  return userData?.userByName?.__typename === "UserByNameSuccess" &&
    data?.userTweets.__typename === "TweetConnection" ? (
    <VirtualizedList
      data={data!.userTweets?.edges!}
      userId={userData!.userByName!.node.id!}
      loadMore={loadMore}
      hasNextPage={data!.userTweets?.pageInfo!.hasNextPage}
      showBorder={true}
      showConnector={false}
    />
  ) : data?.userTweets.__typename === "TweetsInvalidInputError" ? (
    <BaseStylesDiv flexGrow>
      <JustifyCenter>
        <SpanContainer bigger bolder>
          <span>{data.userTweets.message}</span>
        </SpanContainer>
      </JustifyCenter>
    </BaseStylesDiv>
  ) : null;
};

const UserTweetsAndReplies = () => {
  const { username } = useParams<{ username: string }>();

  const { data: userData } = useQuery<GetUserByNameQuery>(
    GetUserByNameDocument,
    {
      variables: { username },
    }
  );
  const userId =
    userData?.userByName.__typename === "UserByNameSuccess"
      ? userData.userByName.node.id
      : "";
  const { data, loading, fetchMore } = useQuery<UserTweetsAndRepliesQuery>(
    UserTweetsAndRepliesDocument,
    {
      variables: {
        userId,
      },
    }
  );

  const loadMore = async (): Promise<any> => {
    try {
      const after =
        data?.userTweetsAndReplies.__typename === "TweetConnection" &&
        data.userTweetsAndReplies.pageInfo.endCursor;
      await fetchMore({
        variables: {
          userId,
          after,
        },
      });
    } catch (error) {
      return error;
    }
  };

  if (loading) return <Spinner />;

  return userData?.userByName?.__typename === "UserByNameSuccess" &&
    data?.userTweetsAndReplies.__typename === "TweetConnection" ? (
    <VirtualizedList
      data={data!.userTweetsAndReplies!.edges!}
      userId={userData!.userByName!.node.id}
      hasNextPage={data!.userTweetsAndReplies!.pageInfo.hasNextPage!}
      loadMore={loadMore}
      showBorder={true}
      showConnector={false}
    />
  ) : data?.userTweetsAndReplies.__typename === "TweetsInvalidInputError" ? (
    <BaseStylesDiv flexGrow>
      <JustifyCenter>
        <SpanContainer bigger bolder>
          <span>{data.userTweetsAndReplies.message}</span>
        </SpanContainer>
      </JustifyCenter>
    </BaseStylesDiv>
  ) : null;
};

const UserLikedTweets = () => {
  const { username } = useParams<{ username: string }>();
  const { data: userData } = useQuery<GetUserByNameQuery>(
    GetUserByNameDocument,
    {
      variables: { username },
    }
  );
  const userId =
    userData?.userByName.__typename === "UserByNameSuccess"
      ? userData.userByName.node.id
      : "";
  const { data, loading, fetchMore } = useQuery<UserLikedTweetsQuery>(
    UserLikedTweetsDocument,
    {
      variables: {
        userId,
      },
    }
  );
  const loadMore = async (): Promise<any> => {
    try {
      const after =
        data?.userLikedTweets.__typename === "TweetConnection" &&
        data.userLikedTweets.pageInfo.endCursor;
      await fetchMore({
        variables: {
          userId,
          after,
        },
      });
    } catch (error) {
      return error;
    }
  };

  if (loading) return <Spinner />;

  return userData?.userByName?.__typename === "UserByNameSuccess" &&
    data?.userLikedTweets.__typename === "TweetConnection" ? (
    <VirtualizedList
      data={data!.userLikedTweets!.edges!}
      userId={userData!.userByName!.node.id}
      loadMore={loadMore}
      hasNextPage={data!.userLikedTweets!.pageInfo.hasNextPage!}
      showBorder={true}
      showConnector={false}
    />
  ) : data?.userLikedTweets.__typename === "TweetsInvalidInputError" ? (
    <BaseStylesDiv flexGrow>
      <JustifyCenter>
        <SpanContainer bigger bolder>
          <span>{data.userLikedTweets.message}</span>
        </SpanContainer>
      </JustifyCenter>
    </BaseStylesDiv>
  ) : null;
};

const tabsData = [
  {
    title: "Tweets",
    body: <UserTweets />,
  },
  {
    title: "Tweets & Replies",
    body: <UserTweetsAndReplies />,
  },
  {
    title: "Media",
    body: <UserTweets />,
  },
  {
    title: "Likes",
    body: <UserLikedTweets />,
  },
];

export const Profile: React.FC<Props> = ({ user }) => {
  let location = useLocation();
  const { openModal, setOpen } = useModalContext();
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
    <BaseStylesDiv flexColumn>
      <S.Background />
      <StyledHeaderContainer>
        <AvatarContainer
          width={134}
          height="134px"
          borderColor
          borderWidth
          marginTop="-80px"
          noRightMargin
        >
          <StyledAvatar url={user.avatar!} />
        </AvatarContainer>
        {data!.authUser?.id === user.id ? (
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
      <Tabs data={tabsData} />
    </BaseStylesDiv>
  );
};
