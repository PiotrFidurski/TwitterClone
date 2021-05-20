import * as React from "react";
import { useParams } from "react-router-dom";
import { BaseStylesDiv } from "../../styles";
import { DropdownProvider } from "../DropDown/context";
import { dynamicReducer } from "../DropDown/reducers";
import {
  StyledTweetWrapper,
  StyledDetailsContainer,
} from "../TweetComposition/styles";
import { Tweet } from "../TweetComposition";
import { Header } from "../TweetComposition/Header";
import { TweetProvider } from "../TweetContext";
import { ItemData } from "./types";

interface Props {
  index: number;
  data: ItemData;
  style: React.CSSProperties;
}

export const Row: React.FC<Props> = React.memo(
  ({ ...props }) => {
    const { data, index, style } = props;

    const { array, setRowHeight, userId, showThreadLine, showTweetBorder } =
      data;

    const { tweetId } = useParams<{ tweetId: string }>();

    const rowRef = React.useRef<HTMLDivElement>(null);

    const listLength = array.length;

    const updateSize = React.useCallback(() => {
      if (rowRef && rowRef.current)
        setRowHeight(index, rowRef.current.clientHeight);
    }, [setRowHeight, index]);

    React.useEffect(() => {
      if (tweetId) {
        setTimeout(() => {
          updateSize();
        }, 30);
      }
    }, [updateSize, tweetId, listLength]);

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
          <TweetProvider
            tweet={array![index]}
            prevTweet={array![index - 1]}
            userId={userId}
          >
            <Tweet showTweetBorder={showTweetBorder}>
              <Tweet.ShowThread />
              <StyledTweetWrapper>
                <Tweet.Thread />
                <BaseStylesDiv>
                  <Tweet.Avatar showThreadLine={showThreadLine} />
                  <StyledDetailsContainer>
                    <Tweet.Header displayDate>
                      <DropdownProvider reducer={dynamicReducer}>
                        <Header.Options />
                      </DropdownProvider>
                    </Tweet.Header>
                    <Tweet.ReplyingTo />
                    <Tweet.Body />
                    <Tweet.Footer />
                  </StyledDetailsContainer>
                </BaseStylesDiv>
              </StyledTweetWrapper>
            </Tweet>
            {tweetId &&
              !!array[index].replyCount &&
              array[index].inReplyToId !== tweetId &&
              !array.some((el: any) => el.inReplyToId === array![index].id) && (
                <Tweet.ShowMoreReplies tweet={array![index]} />
              )}
          </TweetProvider>
        </div>
      </div>
    );
  },
  (prevProps, nextProps) => prevProps === nextProps
);
