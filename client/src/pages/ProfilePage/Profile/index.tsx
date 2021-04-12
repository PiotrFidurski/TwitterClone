import * as React from "react";
import {
  SpanContainer,
  BaseStylesDiv,
  StyledAvatar,
  BaseStyles,
  Spinner,
} from "../../../styles";
import { AvatarContainer, ButtonContainer } from "../../../styles";
import * as S from "./styles";
import { Tabs } from "./Tabs";
import format from "date-fns/format";
import {
  MessageUserMutation,
  useAuthUserQuery,
  useFollowUserMutation,
  useLikedPostsQuery,
  usePostsAndRepliesQuery,
  User,
  UserByNameQuery,
  UserInboxDocument,
  UserInboxQuery,
  UserPostsDocument,
  UserPostsQuery,
  useUserByNameQuery,
} from "../../../generated/graphql";
import { ReactComponent as Message } from "../../../components/svgs/Messages.svg";
import { useHistory, useLocation, useParams } from "react-router-dom";
import { StyledLink } from "../../../styles";
import styled from "styled-components";
import {
  MessageUserDocument,
  UserByNameDocument,
  UserInboxQueryResult,
} from "../../../generated/introspection-result";
import { VirtualizedList } from "../../../components/VirtualizedList";
import { useApolloClient, useMutation, useQuery } from "@apollo/client";
import { localConversation } from "../../../cache";

interface Props {
  user: User;
  inbox: UserInboxQueryResult;
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

const Tweets = () => {
  const { username } = useParams<{ username: string }>();

  const { data: userData, loading: userLoading } = useQuery(
    UserByNameDocument,
    {
      variables: { username: username! },
    }
  );

  const { data, loading, fetchMore } = useQuery<UserPostsQuery>(
    UserPostsDocument,
    {
      variables: { userId: userData! && userData!.userByName!.node!.id! },
    }
  );

  const loadMore = async (): Promise<any> => {
    try {
      await fetchMore({
        variables: {
          userId: userData!.userByName!.node!.id!,
          offset: data!.userPosts!.length!,
        },
        updateQuery: (prev: any, { fetchMoreResult }) => {
          if (!fetchMoreResult) return prev;
          return {
            userPosts: [...prev.userPosts!, ...fetchMoreResult!.userPosts!],
          };
        },
      });
    } catch (error) {}
  };

  if (loading || userLoading) return <Spinner />;

  return data! ? (
    <VirtualizedList
      data={data!.userPosts!}
      itemCount={data!.userPosts!.length}
      userId={userData!.userByName.node!.id!}
      loadMore={loadMore}
      showBorder={true}
      showConnector={false}
    />
  ) : null;
};

const TweetsAndReplies = () => {
  const { username } = useParams<{ username: string }>();

  const { data: userData }: any = useUserByNameQuery({
    variables: { username: username! },
  });

  const { data, loading, fetchMore } = usePostsAndRepliesQuery({
    variables: { userId: userData!.userByName!.node!.id! },
  });

  const loadMore = async (): Promise<any> => {
    try {
      await fetchMore({
        variables: {
          userId: userData!.userByName!.node!.id!,
          offset: data!.postsAndReplies!.length!,
        },
        updateQuery: (prev: any, { fetchMoreResult }: any) => {
          if (!fetchMoreResult) return prev;
          return {
            postsAndReplies: [
              ...prev.postsAndReplies!,
              ...fetchMoreResult!.postsAndReplies!,
            ],
          };
        },
      });
    } catch (error) {}
  };

  if (loading) return <Spinner />;
  return (
    <VirtualizedList
      data={data!.postsAndReplies!}
      itemCount={data!.postsAndReplies!.length}
      userId={userData!.userByName!.node!.id}
      loadMore={loadMore}
      showBorder={true}
      showConnector={false}
    />
  );
};

const LikedPosts = () => {
  const { username } = useParams<{ username: string }>();
  const { data: userData }: any = useQuery<UserByNameQuery>(
    UserByNameDocument,
    {
      variables: { username: username! },
    }
  );
  const { data, loading, fetchMore } = useLikedPostsQuery({
    variables: { userId: userData!.userByName!.node!.id! },
  });
  const loadMore = async (): Promise<any> => {
    try {
      await fetchMore({
        variables: {
          userId: userData!.userByName!.node!.id!,
          offset: data!.likedPosts!.length!,
        },
        updateQuery: (prev: any, { fetchMoreResult }) => {
          if (!fetchMoreResult) return prev;
          return {
            likedPosts: [...prev.likedPosts!, ...fetchMoreResult!.likedPosts!],
          };
        },
      });
    } catch (error) {}
  };

  if (loading) return <Spinner />;
  return (
    <VirtualizedList
      data={data!.likedPosts!}
      itemCount={data!.likedPosts!.length}
      userId={userData!.userByName!.node!.id!}
      loadMore={loadMore}
      showBorder={true}
      showConnector={false}
    />
  );
};

const tabsData = [
  {
    title: "Tweets",
    body: <Tweets />,
  },
  {
    title: "Tweets & Replies",
    body: <TweetsAndReplies />,
  },
  {
    title: "Media",
    body: <Tweets />,
  },
  {
    title: "Likes",
    body: <LikedPosts />,
  },
];

export const Profile: React.FC<Props> = ({ user, inbox }) => {
  let location = useLocation();

  const [message] = useMutation<MessageUserMutation>(MessageUserDocument, {
    variables: { userId: user!.id },
  });
  const history = useHistory();
  const { cache } = useApolloClient();
  const { data } = useAuthUserQuery();
  const [followUser] = useFollowUserMutation({
    variables: { id: user!.id! },
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
            const newRef = toReference(res!.data!.messageUser!.id);
            const userRef = toReference(user.id);

            if (
              cachedEntries.conversations.some(
                (ref: any) => ref!.__ref === newRef!.__ref
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
      history.push(`/messages/${res!.data!.messageUser!.conversationId}`);
    } catch (error) {
      throw new Error(error);
    }
  };

  const handleFollowUser = () => {
    followUser();
  };

  return (
    <div style={{ position: "relative" }}>
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
        {data && data!.authUser!.id === user.id ? (
          <StyledLink
            style={{ flexGrow: 0 }}
            to={{
              pathname: `/settings/profile`,
              state: {
                isModalLoc: location,
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
                onClick={() => {
                  startMessage();
                }}
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
    </div>
  );
};
