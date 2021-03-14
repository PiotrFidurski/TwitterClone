import * as React from "react";

export const useDimensionsOnResize = (callback?: (value: any) => void) => {
  const ref = React.useRef<HTMLDivElement | any>(null);
  const [dimensions, setDimensions] = React.useState<
    DOMRectReadOnly | undefined
  >(undefined);

  const handleResize = React.useCallback(() => {
    const top =
      ref.current &&
      ref.current!.getBoundingClientRect().top -
        document.body!.getBoundingClientRect().top;

    const size = ref.current && ref.current!.getBoundingClientRect().toJSON();

    if (ref.current && dimensions === undefined) {
      setDimensions({
        ...size,
        top,
      });
      // callback && callback!({ ...size, top });
    }

    ref.current &&
      dimensions !== undefined &&
      setDimensions((dimensions) => ({
        ...dimensions!,
        top: top!,
      }));
    // callback && callback!({ ...dimensions!, top: top! });
  }, [dimensions]);

  const clientHeight =
    document.getElementById("feed")! &&
    document.getElementById("feed")!.clientHeight;

  React.useEffect(() => {
    handleResize();
    // eslint-disable-next-line
  }, [clientHeight]);

  React.useEffect(() => {
    let movementMs: any = null;

    const timeout = 50;

    handleResize();

    window.addEventListener("resize", () => {
      clearInterval(movementMs);
      movementMs = setTimeout(handleResize, timeout);
    });

    return () =>
      window.removeEventListener("resize", () => {
        clearInterval(movementMs);
      });
    // eslint-disable-next-line
  }, [window.innerWidth]);

  return { ref, dimensions, setDimensions } as const;
};
