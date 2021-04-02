import * as React from "react";
import { VariableSizeList } from "react-window";
import memoize from "memoize-one";
import InfiniteLoader from "react-window-infinite-loader";
import { WindowScroller } from "react-virtualized/dist/es/WindowScroller";
import { Row } from "./Row";
import { ApolloQueryResult } from "@apollo/client";
import { FeedQuery, RepliesQuery } from "../../generated/introspection-result";
import { JustifyCenter, SpanContainer, Spinner } from "../../styles";

const mergeRefs = (...refs: Array<any>) => (ref: any) => {
  refs.forEach((possibleRef) => {
    if (typeof possibleRef === "function") {
      possibleRef(ref);
    } else {
      (possibleRef as any).current = ref;
    }
  });
};

interface Props {
  data: any[];
  loadMore: () => Promise<ApolloQueryResult<FeedQuery | RepliesQuery>>;
  itemCount?: number;
  userId: string;
  showBorder?: boolean;
  showConnector?: boolean;
  loading?: boolean;
}

const createItemData = memoize(
  (array, setRowHeight, userId, showBorder, showConnector) => ({
    array,
    setRowHeight,
    userId,
    showBorder,
    showConnector,
  })
);

export const VirtualizedList: React.FC<Props> = ({
  data,
  loadMore,
  userId,
  showBorder,
  showConnector,
  itemCount,
  loading,
}) => {
  const listRef = React.useRef<VariableSizeList>(null);

  const rowHeight = React.useRef<HTMLElement | {}>({});

  const setRowHeight = React.useCallback((index, size) => {
    listRef && listRef.current && listRef!.current!.resetAfterIndex(0);
    rowHeight!.current = { ...rowHeight.current, [index]: size };
  }, []);

  const getRowHeight = React.useCallback((index: number) => {
    return (rowHeight && rowHeight.current && rowHeight.current[index]) || 90;
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

  const isItemLoaded = (index: number) =>
    data!.length > 0 && data![index]
      ? data!.some((item: any) => item.id !== data![index].id)
      : false;

  const itemData = createItemData(
    data,
    setRowHeight,
    userId,
    showBorder,
    showConnector
  );

  return (
    <InfiniteLoader
      itemCount={data!.length + 1}
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
