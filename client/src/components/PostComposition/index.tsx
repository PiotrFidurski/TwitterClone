import * as React from "react";
import { Link, useHistory, useLocation, useParams } from "react-router-dom";
import {
  AuthUserDocument,
  AuthUserQuery,
  DeletePostDocument,
  DeletePostMutation,
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
import { LikePost } from "./LikePost";
import { ReactComponent as Retweet } from "../svgs/Retweet.svg";
import { ReactComponent as Options } from "../svgs/Options.svg";
import { usePost } from "../PostContext";
import { DisplayMoreButton } from "./DisplayMoreButton";
import { LoadMore } from "./LoadMore";
import { Post as PostType } from "../../generated/introspection-result";
import { useApolloClient, useMutation, useQuery } from "@apollo/client";
import { useModalContext } from "../context/ModalContext";

interface Props {
  showBorder?: boolean;
}

type PostComposition = {
  ShowThread: React.FC;
  Threaded: React.FC;
  Avatar: React.FC;
  Header: React.FC<HeaderProps>;
  ReplyingTo: React.FC;
  Body: React.FC<BodyProps>;
  Footer: React.FC<FooterProps>;
  LoadMore: React.FC<{
    post: PostType;
  }>;
};

export const Post: React.FC<Props> & PostComposition = ({
  children,
  showBorder,
}) => {
  const history = useHistory();

  const { post } = usePost();

  const handleRedirect = (event: React.MouseEvent<HTMLDivElement>) => {
    event.stopPropagation();
    if (!window.getSelection()!.toString())
      history!.push(`/${post.owner!.username}/status/${post!.id}`);
  };

  return (
    <StyledArticle border={showBorder} onClick={handleRedirect}>
      {children}
    </StyledArticle>
  );
};

const ShowThread: React.FC = () => {
  const { post, prevItem } = usePost();

  return prevItem &&
    prevItem.conversationId === prevItem.id &&
    prevItem.id !== post.inReplyToId! &&
    prevItem.conversationId! === post.conversationId! ? (
    <DisplayMoreButton post={post} isPostView={false}>
      Show this thread
    </DisplayMoreButton>
  ) : null;
};

const Threaded: React.FC = () => {
  const { prevItem, post } = usePost();

  const isReply =
    prevItem &&
    post!.id !== post!.conversationId &&
    (prevItem.id === post!.inReplyToId! ||
      prevItem.id === post!.conversationId!);

  return (
    <PlaceHolder noPadding={isReply}>
      <StyledSpacingWrapper>
        {isReply ? <Connector isReply /> : null}
      </StyledSpacingWrapper>
    </PlaceHolder>
  );
};

const Avatar: React.FC = ({ children }) => {
  const { post } = usePost();
  return (
    <StyledAvatarWrapper>
      <AvatarContainer height="49px" width="49px">
        <StyledAvatar url={post!.owner!.avatar!} />
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
  const { post } = usePost();

  return (
    <StyledHeaderContainer>
      <StyledHeaderWrapper>
        <BaseStylesDiv flexColumn={flexColumn} flexShrink>
          <SpanContainer marginRight>
            <StyledLink
              $textunderline
              onClick={(e) => e.stopPropagation()}
              id="_interactive-icon"
              to={`/user/${post!.owner!.username}`}
            >
              <SpanContainer bold style={{ flexShrink: 1 }}>
                <span>{post!.owner!.name}</span>
              </SpanContainer>
            </StyledLink>
          </SpanContainer>
          <SpanContainer grey style={{ flexShrink: 3 }}>
            <span>@{post!.owner!.username}</span>
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
              <span>{convertDateToTime(post)}</span>
            </SpanContainer>
          </>
        ) : null}
      </StyledHeaderWrapper>
      {children}
    </StyledHeaderContainer>
  );
};

const Menu: React.FC = () => {
  const { post, userId, prevItem } = usePost();
  const [deletePost] = useMutation<DeletePostMutation>(DeletePostDocument);
  const [followUser] = useMutation<FollowUserMutation>(FollowUserDocument, {
    variables: { id: post!.owner!.id! },
    optimisticResponse: {
      __typename: "Mutation",
      followUser: {
        __typename: "UpdateResourceResponse",
        node: { ...post!.owner!, isFollowed: !post!.owner!.isFollowed },
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

  const evictPost = () => {
    deletePost({
      variables: { id: post!.id! },
    });
    const possibleParent =
      prevItem !== undefined && prevItem.id === post.inReplyToId
        ? prevItem
        : {};

    cache.modify({
      id: cache.identify(possibleParent!),
      fields: {
        replyCount(cachedCount) {
          return cachedCount - 1;
        },
      },
    });
    cache.evict({ id: cache.identify(post) });
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
            {post!.owner!.id === userId && (
              <StyledDropDownItem
                danger
                id="dropdown-item"
                onClick={() =>
                  openModal("deletePostAlert", { deletePost: evictPost })
                }
              >
                <Delete />
                <SpanContainer>
                  <span>Delete</span>
                </SpanContainer>
              </StyledDropDownItem>
            )}
            <NavLink
              id="dropdown-item"
              style={{ textDecoration: "none" }}
              to={{
                pathname: "/i/display",
                state: {
                  isModalLoc: location,
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
            {data!.authUser!.id !== post!.owner!.id ? (
              <StyledDropDownItem
                id="dropdown-item"
                onClick={() => {
                  if (!data!.authUser!.username) {
                    openModal("loginAlert", { closeModal: setOpen });
                  } else {
                    post!.owner!.isFollowed
                      ? openModal("unfollowUserAlert", {
                          unfollowUser: followUser,
                          user: post!.owner!,
                        })
                      : followUser();
                  }

                  close();
                }}
              >
                {post!.owner!.isFollowed || !data!.authUser!.username ? (
                  <FollowPlus />
                ) : (
                  <FollowMinus />
                )}
                <SpanContainer>
                  <span>
                    {post!.owner!.isFollowed
                      ? `Unfollow @${post!.owner!.username}`
                      : `Follow @${post!.owner!.username}`}
                  </span>
                </SpanContainer>
              </StyledDropDownItem>
            ) : null}
            <StyledDropDownItem id="dropdown-item">
              <Mute />
              <SpanContainer>
                <span>Mute @{post!.owner!.username!}</span>
              </SpanContainer>
            </StyledDropDownItem>
            <StyledDropDownItem id="dropdown-item">
              <Block />
              <SpanContainer>
                <span>Block @{post!.owner!.username!}</span>
              </SpanContainer>
            </StyledDropDownItem>
          </BaseStylesDiv>
        </BaseStylesDiv>
      </DropdownProvider.Menu>
    </div>
  );
};

const ReplyingTo: React.FC = () => {
  const { post, prevItem } = usePost();
  const { postId } = useParams<{ postId: string }>();

  return prevItem &&
    post.inReplyToId !== null &&
    prevItem.id !== post!.inReplyToId! ? (
    <BaseStylesDiv>
      <Link
        to={`/user/${post!.owner!.username}`}
        style={{ textDecoration: "none", color: "inherit" }}
      >
        {post.inReplyToId !== prevItem.id && post.inReplyToId !== postId ? (
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
  const { post } = usePost();
  return (
    <BaseStylesDiv flexShrink>
      <BaseStylesDiv
        flexGrow
        style={{ flexBasis: "0px", width: "0px", minWidth: "0px" }}
      >
        <SpanContainer biggest={biggest} breakSpaces>
          <span>{post!.body}</span>
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
  const { post } = usePost();
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
                data!.authUser!.username
                  ? {
                      pathname: "/posts/compose",
                      state: {
                        isModalLoc: location,
                        postId: post!.id,
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
                <span>{post.replyCount! > 0 ? post.replyCount! : null}</span>
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
        <LikePost />
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

Post.ShowThread = ShowThread;
Post.Threaded = Threaded;
Post.Avatar = Avatar;
Post.Header = Header;
Header.Menu = Menu;
Post.ReplyingTo = ReplyingTo;
Post.Body = Body;
Post.Footer = Footer;
Post.LoadMore = LoadMore;
