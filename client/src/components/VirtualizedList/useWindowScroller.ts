import * as React from "react";
import { ListOnScrollProps, VariableSizeList } from "react-window";

function useWindowScroller(listRef: React.RefObject<VariableSizeList>) {
  const outerRef = React.useRef<HTMLElement | null>();

  React.useEffect(() => {
    const handleWindowScroll = () => {
      const offsetTop = outerRef.current?.offsetTop ?? 0;
      // where list starts from the top of the page

      const scrollTop = window.pageYOffset - offsetTop;
      // pixels we are scrolled in vertically - offsetTop
      listRef?.current?.scrollTo(scrollTop);
      // scroll the list to that offset
    };

    window.addEventListener("scroll", handleWindowScroll);
    return () => window.removeEventListener("scroll", handleWindowScroll);
  }, [listRef]);

  const onScroll = React.useCallback(
    ({ scrollOffset, scrollUpdateWasRequested }: ListOnScrollProps) => {
      if (!scrollUpdateWasRequested) return;

      const offsetTop = outerRef.current?.offsetTop ?? 0;
      const top = window.pageYOffset;
      scrollOffset += Math.min(top, offsetTop);

      if (scrollOffset !== top) window.scrollTo(0, scrollOffset);
    },
    []
  );

  return [outerRef, onScroll] as const;
}

export { useWindowScroller };
