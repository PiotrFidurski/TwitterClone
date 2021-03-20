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
  useSuggestedUsersQuery,
  FollowUserMutation,
} from "../../generated/graphql";
import { useMutation } from "@apollo/client";
import { FollowUserDocument } from "../../generated/introspection-result";
import { useModalContext } from "../context/ModalContext";

interface Props {
  user: User;
}
export const WhoToFollow: React.FC<Props> = ({ user }) => {
  const { data, loading } = useSuggestedUsersQuery();

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
            data!
              .suggestedUsers!.filter((_user) => user && _user.id !== user.id)
              .map((user) => {
                return <UserToFollow key={user.id} userToFollow={user} />;
              })}
          <div style={{ padding: "10px 15px 10px 15px" }}>
            <SpanContainer>
              <span>Show More</span>
            </SpanContainer>
          </div>
        </div>
      )}
    </StyledContainer>
  );
};

interface UserToFollowProps {
  userToFollow: User;
}

const UserToFollow: React.FC<UserToFollowProps> = ({ userToFollow }) => {
  const { openModal } = useModalContext();
  const [followUser] = useMutation<FollowUserMutation>(FollowUserDocument, {
    variables: { id: userToFollow.id },
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
};
