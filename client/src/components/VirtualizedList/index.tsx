import * as React from "react";
import { VariableSizeList } from "react-window";
import memoize from "memoize-one";
import InfiniteLoader from "react-window-infinite-loader";
import { WindowScroller } from "react-virtualized/dist/es/WindowScroller";
import { Row } from "./Row";
import { ApolloQueryResult } from "@apollo/client";
import { FeedQuery, RepliesQuery } from "../../generated/introspection-result";
import { JustifyCenter, SpanContainer, Spinner } from "../../styles";
import { mergeRefs } from "../../utils/functions";
import { Tweet } from "../../generated/graphql";

interface Props {
  data: Tweet[];
  loadMore: () => Promise<ApolloQueryResult<FeedQuery | RepliesQuery>>;
  userId: string;
  showBorder?: boolean;
  showConnector?: boolean;
  loading?: boolean;
  hasNextPage?: boolean;
}

const createItemData = memoize(
  (
    array: Tweet[],
    setRowHeight: (index: any, size: any) => void,
    userId: string,
    showBorder: boolean,
    showConnector: boolean
  ) => ({
    array,
    setRowHeight,
    userId,
    showBorder,
    showConnector,
  })
);

export const VirtualizedList: React.FC<Props> = ({ ...props }) => {
  const {
    data,
    loadMore,
    userId,
    showBorder,
    hasNextPage,
    showConnector,
    loading,
  } = props;

  const listRef = React.useRef<VariableSizeList>(null);

  const rowHeight = React.useRef<HTMLElement | {}>({});

  const setRowHeight = React.useCallback((index, size) => {
    listRef?.current?.resetAfterIndex(0);
    rowHeight!.current = { ...rowHeight.current, [index]: size };
  }, []);

  const getRowHeight = React.useCallback((index: number) => {
    return rowHeight?.current[index] || 90;
  }, []);

  const itemKey = React.useCallback(
    (index: number) => {
      const item = data[index];

      return item.id;
    },
    [data]
  );

  const handleScroll = React.useCallback(({ scrollTop }) => {
    if (listRef.current) {
      listRef.current.scrollTo(scrollTop);
    }
  }, []);

  const isItemLoaded = (index: number) => !hasNextPage! || index < data.length!;

  const itemData = createItemData(
    data,
    setRowHeight,
    userId,
    showBorder!,
    showConnector!
  );

  return (
    <InfiniteLoader
      itemCount={hasNextPage! ? data.length! + 10 : data.length!}
      loadMoreItems={loading ? async () => {} : loadMore}
      isItemLoaded={isItemLoaded}
    >
      {({ onItemsRendered, ref }) => (
        <WindowScroller onScroll={handleScroll}>
          {() => (
            <>
              <VariableSizeList
                ref={mergeRefs(...[ref, listRef])}
                height={window.innerHeight}
                width={600}
                onItemsRendered={onItemsRendered}
                className="window-scroller-override"
                itemSize={getRowHeight}
                itemData={itemData}
                itemKey={itemKey}
                itemCount={data.length}
                innerElementType={renderAtBottom}
              >
                {Row}
              </VariableSizeList>
              <JustifyCenter
                style={{
                  marginTop: "-600px",
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
            </>
          )}
        </WindowScroller>
      )}
    </InfiniteLoader>
  );
};
