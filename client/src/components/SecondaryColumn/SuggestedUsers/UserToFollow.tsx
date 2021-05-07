import { useMutation } from "@apollo/client";
import * as React from "react";
import { useHistory, Link } from "react-router-dom";
import {
  User,
  FollowUserMutation,
  FollowUserDocument,
} from "../../../generated/graphql";
import {
  AvatarContainer,
  StyledAvatar,
  BaseStylesDiv,
  StyledLink,
  SpanContainer,
  ButtonContainer,
} from "../../../styles";
import { useModalContext } from "../../context/ModalContext";
import { StyledHoverWrapper } from "../styles";
import { StyledHeader } from "./styles";

interface UserToFollowProps {
  userToFollow: User;
}

export const UserToFollow: React.FC<UserToFollowProps> = React.memo(
  ({ userToFollow }) => {
    const history = useHistory();

    const { openModal } = useModalContext();

    const [followUser] = useMutation<FollowUserMutation>(FollowUserDocument, {
      variables: { userId: userToFollow.id },

      optimisticResponse: {
        __typename: "Mutation",
        followUser: {
          __typename: "UpdateResourceResponse",
          node: {
            ...userToFollow,
            isFollowed: !userToFollow.isFollowed,
            followers: [],
          },
        },
      },
    });

    const handleFollowUser = (e: React.BaseSyntheticEvent) => {
      e.stopPropagation();
      userToFollow.isFollowed
        ? openModal("unfollowUserAlert", {
            unfollowUser: followUser,
            user: userToFollow,
          })
        : followUser();
    };

    return (
      <StyledHoverWrapper
        hover
        style={{ display: "flex" }}
        onClick={() => {
          history.push(`/user/${userToFollow.username}`);
        }}
      >
        <Link
          onClick={(e) => e.stopPropagation()}
          to={{ pathname: `/user/${userToFollow.username}` }}
        >
          <AvatarContainer width={49} height="49px">
            <StyledAvatar url={userToFollow.avatar!} />
          </AvatarContainer>
        </Link>

        <StyledHeader>
          <BaseStylesDiv flexColumn flexShrink>
            <StyledLink
              onClick={(e) => e.stopPropagation()}
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
      </StyledHoverWrapper>
    );
  }
);
