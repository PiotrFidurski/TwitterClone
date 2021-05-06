import * as React from "react";
import { IState } from "./reducers";

export const useDimensions = (
  callback: (value: any) => void,
  state: IState
) => {
  const ref = React.useRef<HTMLDivElement | any>(null);

  const handleResize = React.useCallback(() => {
    const top =
      ref.current &&
      ref.current!.getBoundingClientRect().top -
        document.body!.getBoundingClientRect().top;

    const size = ref.current && ref.current!.getBoundingClientRect().toJSON();

    if (ref.current) {
      const dims = {
        ...size,
        top: top,
      };

      callback({
        type: "set_dimensions",
        value: dims,
      });
    }
  }, [callback]);

  const clientHeight =
    document.getElementById("feed")! &&
    document.getElementById("feed")!.clientHeight;

  React.useLayoutEffect(() => {
    handleResize();

    if (!state.visible && state.width) {
      callback({ type: "set_visibility" });
    }
  }, [handleResize, state.width, state.visible, callback]);

  React.useEffect(() => {
    handleResize();
    // eslint-disable-next-line
  }, [clientHeight]);

  React.useLayoutEffect(() => {
    let movementMs: any = null;

    const timeout = 300;
    setTimeout(() => {
      handleResize();
    }, timeout);

    window.addEventListener("scroll", () => {
      clearInterval(movementMs);
      movementMs = setTimeout(handleResize, timeout);
    });
    window.addEventListener("resize", () => {
      clearInterval(movementMs);
      movementMs = setTimeout(handleResize, timeout);
    });

    return () => {
      window.removeEventListener("resize", () => {
        clearInterval(movementMs);
      });
      window.removeEventListener("scroll", () => {
        clearInterval(movementMs);
      });
    };
  }, [handleResize]);

  return ref;
};
