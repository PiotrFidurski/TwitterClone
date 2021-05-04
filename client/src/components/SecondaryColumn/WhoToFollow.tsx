import * as React from "react";
import {
  AvatarContainer,
  SpanContainer,
  ButtonContainer,
  BaseStylesDiv,
  Spinner,
  StyledAvatar,
  StyledLink,
} from "../../styles";
import { StyledContainer, StyledWrapper, StyledHeader } from "./styles";
import {
  User,
  FollowUserMutation,
  RandomUsersDocument,
  RandomUsersQuery,
} from "../../generated/graphql";
import { useMutation, useQuery } from "@apollo/client";
import { FollowUserDocument } from "../../generated/introspection-result";
import { useModalContext } from "../context/ModalContext";

interface Props {
  user: User;
}
export const WhoToFollow: React.FC<Props> = React.memo(
  ({ user }) => {
    const { data, loading, refetch } = useQuery<RandomUsersQuery>(
      RandomUsersDocument,
      {
        variables: { userId: user!.id! },
      }
    );

    return (
      <StyledContainer>
        {loading ? (
          <Spinner bigMargin />
        ) : (
          <div>
            <StyledWrapper>
              <StyledHeader>
                <SpanContainer bigger bolder>
                  <span>Who to Follow</span>
                </SpanContainer>
              </StyledHeader>
            </StyledWrapper>
            {data &&
              data!.randomUsers!.map((user) => {
                return <UserToFollow key={user.id} userToFollow={user} />;
              })}
            <div style={{ padding: "10px 15px 10px 15px" }}>
              <ButtonContainer
                onClick={() => {
                  refetch({ variables: { userId: user!.id! } });
                }}
              >
                <div>
                  <SpanContainer>
                    <span>Refresh</span>
                  </SpanContainer>
                </div>
              </ButtonContainer>
            </div>
          </div>
        )}
      </StyledContainer>
    );
  },
  (prevProps, nextProps) => prevProps.user!.id === nextProps.user.id
);

interface UserToFollowProps {
  userToFollow: User;
}

const UserToFollow: React.FC<UserToFollowProps> = React.memo(
  ({ userToFollow }) => {
    const { openModal } = useModalContext();

    const [followUser] = useMutation<FollowUserMutation>(FollowUserDocument, {
      variables: { userId: userToFollow.id },

      optimisticResponse: {
        __typename: "Mutation",
        followUser: {
          __typename: "UpdateResourceResponse",
          node: { ...userToFollow, isFollowed: !userToFollow.isFollowed },
        },
      },
    });

    const handleFollowUser = () => {
      userToFollow.isFollowed
        ? openModal("unfollowUserAlert", {
            unfollowUser: followUser,
            user: userToFollow,
          })
        : followUser();
    };

    return (
      <StyledWrapper hover style={{ display: "flex" }}>
        <AvatarContainer width={49} height="49px">
          <StyledAvatar url={userToFollow.avatar!} />
        </AvatarContainer>
        <StyledHeader>
          <BaseStylesDiv flexColumn flexShrink>
            <StyledLink
              $textunderline
              to={{ pathname: `/user/${userToFollow.username}` }}
            >
              <SpanContainer bold>
                <span>{userToFollow.name}</span>
              </SpanContainer>
            </StyledLink>

            <SpanContainer grey>
              <span>@{userToFollow.username}</span>
            </SpanContainer>
          </BaseStylesDiv>
          <div>
            <ButtonContainer
              isFollowed={!!userToFollow.isFollowed}
              onClick={handleFollowUser}
              filledVariant={!!userToFollow.isFollowed}
            >
              <div>
                <SpanContainer>
                  <span></span>
                </SpanContainer>
              </div>
            </ButtonContainer>
          </div>
        </StyledHeader>
      </StyledWrapper>
    );
  }
);
