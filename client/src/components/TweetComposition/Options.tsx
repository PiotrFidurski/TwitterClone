import { useMutation, useApolloClient, useQuery } from "@apollo/client";
import * as React from "react";
import {
  DeleteTweetMutation,
  DeleteTweetDocument,
  FollowUserMutation,
  FollowUserDocument,
  AuthUserQuery,
  AuthUserDocument,
} from "../../generated/graphql";
import { HoverContainer, Absolute, SpanContainer } from "../../styles";
import { ReactComponent as Caret } from "../svgs/Caret.svg";
import { ReactComponent as Delete } from "../svgs/Delete.svg";
import { ReactComponent as SadFace } from "../svgs/SadFace.svg";
import { ReactComponent as FollowPlus } from "../svgs/followplus.svg";
import { ReactComponent as FollowMinus } from "../svgs/followminus.svg";
import { ReactComponent as Block } from "../svgs/block.svg";
import { ReactComponent as Mute } from "../svgs/mute.svg";
import { useModal } from "../context/ModalContext";
import {
  useDropdown,
  DropdownProvider as Dropdown,
  close,
} from "../DropDown/context";
import { StyledDropDownItem } from "../DropDown/DropDownComposition/styles";
import { useTweet } from "../TweetContext";

export const Options: React.FC = () => {
  const { tweet, prevTweet } = useTweet();

  const [deleteTweet] = useMutation<DeleteTweetMutation>(DeleteTweetDocument);
  const [followUser] = useMutation<FollowUserMutation>(FollowUserDocument, {
    variables: { userId: tweet!.owner!.id! },
    optimisticResponse: {
      __typename: "Mutation",
      followUser: {
        __typename: "UpdateResourceResponse",
        node: { ...tweet!.owner!, isFollowed: !tweet!.owner!.isFollowed },
      },
    },
  });
  const { dispatch } = useDropdown();
  const { cache } = useApolloClient();
  const { data } = useQuery<AuthUserQuery>(AuthUserDocument, {
    fetchPolicy: "cache-only",
  });
  const { openModal, setOpen } = useModal();

  const evictTweetFromCache = () => {
    deleteTweet({
      variables: { tweetId: tweet!.id! },
    });

    const possibleParent =
      prevTweet !== undefined && prevTweet!.id === tweet.inReplyToId
        ? prevTweet
        : {};

    cache.modify({
      id: cache.identify(possibleParent!),
      fields: {
        replyCount(cachedCount) {
          return cachedCount - 1;
        },
      },
    });

    cache.evict({
      id: cache.identify(tweet),
    });

    cache.gc();
  };

  return (
    <>
      <Dropdown.Toggle>
        <HoverContainer>
          <Absolute />
          <Caret />
        </HoverContainer>
      </Dropdown.Toggle>
      <Dropdown.Menu position="absolute">
        <StyledDropDownItem>
          <SadFace />
          <SpanContainer>
            <span>Not interested in this Tweet</span>
          </SpanContainer>
        </StyledDropDownItem>
        {data?.authUser?.id! === tweet!.owner!.id ? (
          <StyledDropDownItem
            danger
            onClick={() =>
              openModal("deleteTweetAlert", {
                deleteTweet: evictTweetFromCache,
              })
            }
          >
            <Delete />
            <SpanContainer>
              <span>Delete</span>
            </SpanContainer>
          </StyledDropDownItem>
        ) : null}

        {data && data!.authUser!.id !== tweet!.owner!.id ? (
          <StyledDropDownItem
            onClick={() => {
              if (!data!.authUser!.username) {
                openModal("loginAlert", { closeModal: setOpen });
              } else {
                tweet!.owner!.isFollowed
                  ? openModal("unfollowUserAlert", {
                      unfollowUser: followUser,
                      user: tweet!.owner!,
                    })
                  : followUser();
              }

              close(dispatch);
            }}
          >
            {tweet!.owner!.isFollowed || !data!.authUser!.username ? (
              <FollowPlus />
            ) : (
              <FollowMinus />
            )}
            <SpanContainer>
              <span>
                {tweet!.owner!.isFollowed
                  ? `Unfollow @${tweet!.owner!.username}`
                  : `Follow @${tweet!.owner!.username}`}
              </span>
            </SpanContainer>
          </StyledDropDownItem>
        ) : null}
        <StyledDropDownItem>
          <Mute />
          <SpanContainer>
            <span>Mute @{tweet!.owner!.username!}</span>
          </SpanContainer>
        </StyledDropDownItem>
        <StyledDropDownItem>
          <Block />
          <SpanContainer>
            <span>Block @{tweet!.owner!.username!}</span>
          </SpanContainer>
        </StyledDropDownItem>
      </Dropdown.Menu>
    </>
  );
};
