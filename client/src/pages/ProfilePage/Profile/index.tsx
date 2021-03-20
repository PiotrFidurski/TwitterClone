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
import {
  AuthUserDocument,
  useAuthUserQuery,
  useFollowUserMutation,
  useLikedPostsQuery,
  usePostsAndRepliesQuery,
  User,
  useUserByNameQuery,
} from "../../../generated/graphql";
import { useLocation, useParams } from "react-router-dom";
import { StyledLink } from "../../../styles";
import styled from "styled-components";
import { useUserPostsQuery } from "../../../generated/introspection-result";
import { VirtualizedList } from "../../../components/VirtualizedList";
import { useQuery } from "@apollo/client";

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

const Tweets = () => {
  const { data: authUser } = useQuery(AuthUserDocument);

  const { username } = useParams<{ username: string }>();

  const { data: userData, loading: userLoading } = useUserByNameQuery({
    variables: { username: username! },
  });

  const { data, loading, fetchMore } = useUserPostsQuery({
    variables: { userId: userData! && userData!.userByName!.node!.id! },
  });

  const loadMore = async (): Promise<any> => {
    try {
      await fetchMore({
        variables: {
          userId: userData!.userByName!.node!.id!,
          offset: data!.userPosts!.length!,
        },
        updateQuery: (prev, { fetchMoreResult }) => {
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
      userId={authUser!.authUser!.id!}
      loadMore={loadMore}
      showBorder={true}
      showConnector={false}
    />
  ) : null;
};

const TweetsAndReplies = () => {
  const { username } = useParams<{ username: string }>();

  const { data: authUser } = useAuthUserQuery();

  const { data: userData } = useUserByNameQuery({
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
        updateQuery: (prev, { fetchMoreResult }) => {
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
      userId={authUser!.authUser!.id}
      loadMore={loadMore}
      showBorder={true}
      showConnector={false}
    />
  );
};

const LikedPosts = () => {
  const { data: authUser } = useAuthUserQuery();
  const { username } = useParams<{ username: string }>();
  const { data: userData } = useUserByNameQuery({
    variables: { username: username! },
  });
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
        updateQuery: (prev, { fetchMoreResult }) => {
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
      userId={authUser!.authUser!.id}
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

export const Profile: React.FC<Props> = ({ user }) => {
  let location = useLocation();

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

  const { data } = useAuthUserQuery();

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
          <SpanContainer grey>
            <span>@{user.username}</span>
          </SpanContainer>
          {user!.bio && (
            <SpanContainer
              breakSpaces
              style={{ margin: "10px 0", maxWidth: "-webkit-fill-available" }}
            >
              <span>{user!.bio}</span>
            </SpanContainer>
          )}
          <BaseStylesDiv
            style={{
              marginBottom: "10px",
              maxWidth: "-webkit-fill-available",
              flexWrap: "wrap",
            }}
          >
            <SpanContainer grey breakSpaces marginRight={!!user.website}>
              <span>{user.website}</span>
            </SpanContainer>
            <SpanContainer marginRight>
              <span>Born December 29, 1990</span>
            </SpanContainer>
            <SpanContainer>
              <span>Joined August 2012</span>
            </SpanContainer>
          </BaseStylesDiv>
          <BaseStylesDiv>
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
