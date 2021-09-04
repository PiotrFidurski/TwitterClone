import memoize from "memoize-one";
import * as React from "react";
import { VariableSizeList } from "react-window";
import InfiniteLoader from "react-window-infinite-loader";
import { Tweet } from "../../generated/graphql";
import { JustifyCenter, SpanContainer, Spinner } from "../../styles";
import { Row } from "./Row";
import { Props } from "./types";
import { useWindowScroller } from "./useWindowScroller";

const createItemData = memoize(
  (
    array: Tweet[],
    setRowHeight: (index: any, size: any) => void,
    userId: string,
    showThreadLine: boolean,
    showTweetBorder: boolean
  ) => ({
    array,
    setRowHeight,
    userId,
    showThreadLine,
    showTweetBorder,
  })
);

export const VirtualizedList: React.FC<Props> = ({ ...props }) => {
  const {
    data,
    loadMore,
    userId,
    hasNextPage,
    loading,
    showTweetBorder,
    showThreadLine,
  } = props;

  const listRef = React.useRef<VariableSizeList>(null);

  const [outerRef, onScroll] = useWindowScroller(listRef);

  const rowHeight = React.useRef<HTMLElement | {}>({});

  const setRowHeight = React.useCallback((index, size) => {
    listRef?.current?.resetAfterIndex(0);
    rowHeight!.current = { ...rowHeight.current, [index]: size };
  }, []);

  const getRowHeight = React.useCallback((index: number) => {
    return rowHeight?.current[index] || 95;
  }, []);

  const itemKey = React.useCallback(
    (index: number) => {
      const item = data[index];

      return item.id;
    },
    [data]
  );

  const isItemLoaded = (index: number) => !hasNextPage! || index < data.length!;

  const itemData = createItemData(
    data,
    setRowHeight,
    userId,
    showThreadLine!,
    showTweetBorder!
  );

  return (
    <InfiniteLoader
      itemCount={hasNextPage! ? data.length! + 1 : data.length!}
      loadMoreItems={loading ? async () => {} : (loadMore as any)}
      isItemLoaded={isItemLoaded}
    >
      {({ onItemsRendered, ref }) => (
        <div ref={ref}>
          <VariableSizeList
            ref={listRef}
            height={window.innerHeight}
            outerRef={outerRef}
            width={600}
            onScroll={onScroll}
            onItemsRendered={onItemsRendered}
            itemSize={getRowHeight}
            itemData={itemData}
            itemKey={itemKey}
            itemCount={data.length}
            innerElementType={renderAtBottom}
            style={{
              width: "100%",
              height: "100%",
              display: "inline-block",
            }}
          >
            {Row}
          </VariableSizeList>

          <JustifyCenter
            style={{
              marginTop: "-580px",
              padding: "15px",
              borderBottom: "1px solid var(--colors-border)",
            }}
          >
            <SpanContainer biggest>
              <span>
                {!data!.length ? (
                  "There's nothing here."
                ) : loading ? (
                  <Spinner />
                ) : (
                  "You're all caught up."
                )}
              </span>
            </SpanContainer>
          </JustifyCenter>
        </div>
      )}
    </InfiniteLoader>
  );
};

const renderAtBottom: React.FC<any> = React.forwardRef(
  ({ style, ...rest }: any, ref: React.Ref<HTMLDivElement>) => {
    return (
      <div
        ref={ref}
        style={{
          ...style,
          width: "100%",
          minWidth: "0px",
          display: "flex",
          flexGrow: 1,
          height: `${parseFloat(style.height) + 300 * 2}px`,
        }}
        {...rest}
      />
    );
  }
);
