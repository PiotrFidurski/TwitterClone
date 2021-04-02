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
  MessageUserMutation,
  useAuthUserQuery,
  useFollowUserMutation,
  useLikedPostsQuery,
  usePostsAndRepliesQuery,
  User,
  UserByNameQuery,
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
} from "../../../generated/introspection-result";
import { VirtualizedList } from "../../../components/VirtualizedList";
import { useMutation, useQuery } from "@apollo/client";

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

export const Profile: React.FC<Props> = ({ user }) => {
  let location = useLocation();
  const history = useHistory();
  const [message] = useMutation<MessageUserMutation>(MessageUserDocument, {
    variables: { userId: user!.id },
  });
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
      const msg = await message({
        update: (cache, { data }) => {
          console.log(data);
        },
      });

      if (msg.data!.messageUser!.__typename) {
        // history.push(
        //   `/messages/${msg!.data!.messageUser!.conversations![0]
        //     .conversationId!}`
        // );
      } else {
      }
    } catch (error) {
      console.log(error);
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
                onClick={() => {}}
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
