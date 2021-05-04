import * as React from "react";
import { Link, useHistory, useLocation, useParams } from "react-router-dom";
import {
  AuthUserDocument,
  AuthUserQuery,
  DeleteTweetDocument,
  DeleteTweetMutation,
  FollowUserDocument,
  FollowUserMutation,
} from "../../generated/graphql";
import { ReactComponent as Delete } from "../svgs/Delete.svg";
import { ReactComponent as Display } from "../svgs/display.svg";
import { ReactComponent as Brush } from "../svgs/brush.svg";
import { ReactComponent as SadFace } from "../svgs/SadFace.svg";
import { ReactComponent as FollowPlus } from "../svgs/followplus.svg";
import { ReactComponent as FollowMinus } from "../svgs/followminus.svg";
import { ReactComponent as Block } from "../svgs/block.svg";
import { ReactComponent as Mute } from "../svgs/mute.svg";
import { convertDateToTime } from "../../utils/functions";
import { DropdownProvider, useDropdownCtxt } from "../DropDown";
import {
  Absolute,
  AvatarContainer,
  BaseStylesDiv,
  Connector,
  HoverContainer,
  InteractiveIcon,
  PlaceHolder,
  SpanContainer,
  StyledAvatar,
  StyledLink,
} from "../../styles";
import {
  StyledArticle,
  StyledAvatarWrapper,
  StyledFooterWrapper,
  StyledHeaderContainer,
  StyledHeaderWrapper,
  StyledSpacingWrapper,
} from "./styles";
import { ReactComponent as Caret } from "../svgs/Caret.svg";
import { StyledDropDownItem } from "../DropDown/DropDownComposition/Menu";
import { NavLink } from "../Sidebar/styles";
import { ReactComponent as Reply } from "../svgs/Reply.svg";
import { LikeTweet } from "./LikeTweet";
import { ReactComponent as Retweet } from "../svgs/Retweet.svg";
import { ReactComponent as Options } from "../svgs/Options.svg";
import { useTweet } from "../TweetContext";
import { DisplayMoreButton } from "./DisplayMoreButton";
import { LoadMore } from "./LoadMore";
import { Tweet as TweetType } from "../../generated/introspection-result";
import { useApolloClient, useMutation, useQuery } from "@apollo/client";
import { useModalContext } from "../context/ModalContext";
import { Twemoji } from "../TwemojiPicker/Twemoji";

interface Props {
  showBorder?: boolean;
}

type TweetComposition = {
  ShowThread: React.FC;
  Threaded: React.FC;
  Avatar: React.FC;
  Header: React.FC<HeaderProps>;
  ReplyingTo: React.FC;
  Body: React.FC<BodyProps>;
  Footer: React.FC<FooterProps>;
  LoadMore: React.FC<{
    tweet: TweetType;
  }>;
};

export const Tweet: React.FC<Props> & TweetComposition = ({
  children,
  showBorder,
}) => {
  const history = useHistory();

  const { tweet } = useTweet();

  const handleRedirect = (event: React.MouseEvent<HTMLDivElement>) => {
    event.stopPropagation();
    if (!window.getSelection()!.toString())
      history!.push(`/${tweet.owner!.username}/status/${tweet!.id}`);
  };

  return (
    <StyledArticle border={showBorder} onClick={handleRedirect}>
      {children}
    </StyledArticle>
  );
};

const ShowThread: React.FC = () => {
  const { tweet, prevTweet } = useTweet();

  return prevTweet &&
    prevTweet.conversationId === prevTweet.id &&
    prevTweet.id !== tweet.inReplyToId! &&
    prevTweet.conversationId! === tweet.conversationId! ? (
    <DisplayMoreButton tweet={tweet} isTweetView={false}>
      Show this thread
    </DisplayMoreButton>
  ) : null;
};

const Threaded: React.FC = () => {
  const { prevTweet, tweet } = useTweet();

  const isReply = !!(
    prevTweet &&
    tweet!.id !== tweet!.conversationId &&
    ((prevTweet && prevTweet!.id === tweet!.inReplyToId!) ||
      prevTweet!.id === tweet!.conversationId!)
  );

  return (
    <PlaceHolder noPadding={isReply}>
      <StyledSpacingWrapper>
        {isReply ? <Connector isReply /> : null}
      </StyledSpacingWrapper>
    </PlaceHolder>
  );
};

const Avatar: React.FC = ({ children }) => {
  const { tweet } = useTweet();
  return (
    <StyledAvatarWrapper>
      <AvatarContainer height="49px" width={49}>
        <StyledAvatar url={tweet!.owner!.avatar!} />
      </AvatarContainer>
      {children}
    </StyledAvatarWrapper>
  );
};

interface HeaderComposition {
  Menu: React.FC<any>;
}

interface HeaderProps {
  displayDate?: boolean;
  flexColumn?: boolean;
}

export const Header: React.FC<HeaderProps> & HeaderComposition = ({
  children,
  displayDate,
  flexColumn,
}) => {
  const { tweet } = useTweet();

  return (
    <StyledHeaderContainer>
      <StyledHeaderWrapper>
        <BaseStylesDiv flexColumn={flexColumn} flexShrink>
          <SpanContainer marginRight>
            <StyledLink
              $textunderline
              onClick={(e) => e.stopPropagation()}
              id="_interactive-icon"
              to={`/user/${tweet!.owner!.username}`}
            >
              <SpanContainer bold style={{ flexShrink: 1 }}>
                <span>{tweet!.owner!.name}</span>
              </SpanContainer>
            </StyledLink>
          </SpanContainer>
          <SpanContainer grey style={{ flexShrink: 3 }}>
            <span>@{tweet!.owner!.username}</span>
          </SpanContainer>
        </BaseStylesDiv>
        {displayDate ? (
          <>
            <SpanContainer
              grey
              style={{ flexShrink: 0, padding: "0 5px 0 5px" }}
            >
              <span>·</span>
            </SpanContainer>

            <SpanContainer marginRight grey style={{ flexShrink: 0 }}>
              <span>{convertDateToTime(tweet)}</span>
            </SpanContainer>
          </>
        ) : null}
      </StyledHeaderWrapper>
      {children}
    </StyledHeaderContainer>
  );
};

const Menu: React.FC = () => {
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
  const { close } = useDropdownCtxt();
  const { cache } = useApolloClient();
  const location = useLocation();
  const { data } = useQuery<AuthUserQuery>(AuthUserDocument, {
    fetchPolicy: "cache-only",
  });
  const { openModal, setOpen } = useModalContext();

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
    <div onClick={(e) => e.stopPropagation()}>
      <DropdownProvider.Toggle>
        <HoverContainer>
          <Absolute />
          <Caret />
        </HoverContainer>
      </DropdownProvider.Toggle>
      <DropdownProvider.Menu>
        <BaseStylesDiv>
          <BaseStylesDiv flexColumn>
            <StyledDropDownItem id="dropdown-item">
              <SadFace />
              <SpanContainer>
                <span>Not interested in this Tweet</span>
              </SpanContainer>
            </StyledDropDownItem>
            {data!.authUser!.id === tweet!.owner!.id ? (
              <StyledDropDownItem
                danger
                id="dropdown-item"
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

            <NavLink
              id="dropdown-item"
              style={{ textDecoration: "none" }}
              to={{
                pathname: "/i/display",
                state: {
                  isModalLocaction: location,
                },
              }}
            >
              <StyledDropDownItem id="dropdown-item">
                <Display />
                <Brush style={{ position: "absolute" }} />
                <SpanContainer>
                  <span>Display</span>
                </SpanContainer>
              </StyledDropDownItem>
            </NavLink>
            {data && data!.authUser!.id !== tweet!.owner!.id ? (
              <StyledDropDownItem
                id="dropdown-item"
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

                  close();
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
            <StyledDropDownItem id="dropdown-item">
              <Mute />
              <SpanContainer>
                <span>Mute @{tweet!.owner!.username!}</span>
              </SpanContainer>
            </StyledDropDownItem>
            <StyledDropDownItem id="dropdown-item">
              <Block />
              <SpanContainer>
                <span>Block @{tweet!.owner!.username!}</span>
              </SpanContainer>
            </StyledDropDownItem>
          </BaseStylesDiv>
        </BaseStylesDiv>
      </DropdownProvider.Menu>
    </div>
  );
};

const ReplyingTo: React.FC = () => {
  const { tweet, prevTweet } = useTweet();
  const { tweetId } = useParams<{ tweetId: string }>();

  return prevTweet &&
    tweet.inReplyToId !== null &&
    prevTweet.id !== tweet!.inReplyToId! ? (
    <BaseStylesDiv>
      <Link
        to={`/user/${tweet!.owner!.username}`}
        style={{ textDecoration: "none", color: "inherit" }}
      >
        {tweet.inReplyToId !== prevTweet.id && tweet.inReplyToId !== tweetId ? (
          <SpanContainer grey>
            <span id="link"></span>
          </SpanContainer>
        ) : null}
      </Link>
    </BaseStylesDiv>
  ) : null;
};

interface BodyProps {
  biggest?: boolean;
}

const Body: React.FC<BodyProps> = ({ biggest }) => {
  const { tweet } = useTweet();
  return (
    <BaseStylesDiv flexShrink>
      <BaseStylesDiv
        flexGrow
        style={{ flexBasis: "0px", width: "0px", minWidth: "0px" }}
      >
        <SpanContainer biggest={biggest} breakSpaces>
          <span>
            <Twemoji>{tweet!.body}</Twemoji>
          </span>
        </SpanContainer>
      </BaseStylesDiv>
    </BaseStylesDiv>
  );
};

interface FooterProps {
  marginAuto?: boolean;
}

const Footer: React.FC<FooterProps> = ({ marginAuto }) => {
  const { openModal, setOpen } = useModalContext();
  const { data } = useQuery<AuthUserQuery>(AuthUserDocument, {
    fetchPolicy: "cache-only",
  });
  const { tweet } = useTweet();
  const location = useLocation();
  return (
    <BaseStylesDiv flexGrow>
      <StyledFooterWrapper marginAuto={marginAuto}>
        <InteractiveIcon color={"rgb(29, 161, 242)"}>
          <HoverContainer
            onClick={(e) => {
              e.stopPropagation();
              openModal("loginAlert", { closeModal: setOpen });
            }}
          >
            <StyledLink
              to={
                data && data!.authUser!.username
                  ? {
                      pathname: "/posts/compose",
                      state: {
                        isModalLocaction: location,
                        tweetId: tweet!.id,
                      },
                    }
                  : {}
              }
            >
              <BaseStylesDiv>
                <Absolute biggerMargin />
                <Reply />
              </BaseStylesDiv>
              <SpanContainer smaller textCenter>
                <span>{tweet.replyCount! > 0 ? tweet.replyCount! : null}</span>
              </SpanContainer>
            </StyledLink>
          </HoverContainer>
        </InteractiveIcon>
        <InteractiveIcon color="rgb(23, 191, 99)">
          <HoverContainer onClick={(e) => e.stopPropagation()}>
            <Absolute biggerMargin />
            <Retweet />
          </HoverContainer>
        </InteractiveIcon>
        <LikeTweet />
        <InteractiveIcon color="rgb(29, 161, 242)" style={{ flexGrow: 0 }}>
          <HoverContainer onClick={(e) => e.stopPropagation()}>
            <Absolute biggerMargin />
            <Options />
          </HoverContainer>
        </InteractiveIcon>
      </StyledFooterWrapper>
    </BaseStylesDiv>
  );
};

Tweet.ShowThread = ShowThread;
Tweet.Threaded = Threaded;
Tweet.Avatar = Avatar;
Tweet.Header = Header;
Header.Menu = Menu;
Tweet.ReplyingTo = ReplyingTo;
Tweet.Body = Body;
Tweet.Footer = Footer;
Tweet.LoadMore = LoadMore;
