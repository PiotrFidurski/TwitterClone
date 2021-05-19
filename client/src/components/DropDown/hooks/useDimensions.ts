import * as React from "react";
import { actionTypes, IAction, IState } from "../reducers";

export const useDimensions = (
  state: IState,
  dispatch: React.Dispatch<IAction>
) => {
  const ref = React.useRef<HTMLDivElement | any>(null);

  const handleResize = React.useCallback(() => {
    const top =
      ref?.current?.getBoundingClientRect().top -
      document.body?.getBoundingClientRect().top;

    const size = ref?.current?.getBoundingClientRect().toJSON();

    if (ref.current) {
      const dims = {
        ...size,
        top: top,
      };

      dispatch({
        type: actionTypes.setDimensions,
        value: dims,
      });
    }
  }, [dispatch]);

  const clientHeight =
    document.getElementById("feed")! &&
    document.getElementById("feed")!.clientHeight;

  React.useLayoutEffect(() => {
    handleResize();
  }, [handleResize, state.width, dispatch, clientHeight]);

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
