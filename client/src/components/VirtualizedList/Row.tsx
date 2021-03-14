import * as React from "react";
import { useParams } from "react-router-dom";
import { Post as PostType } from "../../generated/graphql";
import { BaseStylesDiv, Connector } from "../../styles";
import { DropdownProvider } from "../DropDown";
import { moveUpAndLeftReducer } from "../DropDown/reducers";
import {
  StyledPostWrapper,
  StyledDetailsContainer,
} from "../PostComposition/styles";
import { Header, Post } from "../PostComposition";
import { PostProvider } from "../PostContext";

interface Props {
  index: number;
  data: {
    array: PostType[];
    setRowHeight: (index: number, size: number) => void;
    userId: string;
    showBorder: boolean;
    showConnector: boolean;
  };
  style: React.CSSProperties;
}

export const Row: React.FC<Props> = React.memo(
  ({ ...props }) => {
    const { data, index, style } = props;

    const { array, setRowHeight, userId, showBorder, showConnector } = data;
    const { postId } = useParams<{ postId: string }>();
    const rowRef = React.useRef<HTMLDivElement>(null);
    const listLength = array.length;
    const updateSize = React.useCallback(() => {
      if (rowRef && rowRef.current)
        setRowHeight(index, rowRef.current.clientHeight);
    }, [setRowHeight, index]);

    React.useEffect(() => {
      updateSize();

      if (postId) {
        setTimeout(() => {
          updateSize();
        }, 30);
      }
    }, [updateSize, postId, listLength]);

    React.useEffect(() => {
      let movementMs: any = null;

      updateSize();
      window.addEventListener("resize", () => {
        clearInterval(movementMs);
        movementMs = setTimeout(updateSize, 50);
      });

      return () =>
        window.removeEventListener("resize", () => {
          clearInterval(movementMs);
        });
    }, [updateSize]);

    React.useEffect(() => {
      updateSize();
    }, [rowRef, index, setRowHeight, updateSize]);

    return (
      <div
        style={{
          ...style,
          top: `0`,
          transform: `translateY(${style.top}px)`,
          transition: `0.10s transform`,
          width: "100%",
        }}
      >
        <div ref={rowRef}>
          <PostProvider
            post={array![index]}
            prevItem={array![index - 1]}
            userId={userId}
          >
            <Post
              showBorder={showBorder ? showBorder : !array[index].replyCount}
            >
              <Post.ShowThread />
              <StyledPostWrapper>
                <Post.Threaded />
                <BaseStylesDiv>
                  <Post.Avatar>
                    {showConnector && array[index].replyCount ? (
                      <Connector />
                    ) : null}
                  </Post.Avatar>
                  <StyledDetailsContainer>
                    <Post.Header displayDate>
                      <DropdownProvider
                        position="absolute"
                        reducer={moveUpAndLeftReducer}
                      >
                        <Header.Menu />
                      </DropdownProvider>
                    </Post.Header>
                    <Post.ReplyingTo />
                    <Post.Body />
                    <Post.Footer />
                  </StyledDetailsContainer>
                </BaseStylesDiv>
              </StyledPostWrapper>
            </Post>
            {postId &&
              !!array[index].replyCount &&
              array[index].inReplyToId !== postId &&
              !array.some((el: any) => el.inReplyToId === array![index].id) && (
                <Post.LoadMore post={array![index]} />
              )}
          </PostProvider>
        </div>
      </div>
    );
  },
  (prevProps, nextProps) => prevProps === nextProps
);
