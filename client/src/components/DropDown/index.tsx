import * as React from "react";
import { useModalContext } from "../context/ModalContext";
import { Menu } from "./DropDownComposition/Menu";
import { Toggle } from "./DropDownComposition/Toggle";
import { IAction, IState, moveUpReducer } from "./reducers";

const useCalculatedDimensions = (
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

export const useDropDown = ({ reducer = moveUpReducer } = {}) => {
  const { open: modalOpen } = useModalContext();

  const [state, dispatch] = React.useReducer(reducer, {
    open: false,
    dimensions: undefined,
    width: 0,
    height: 0,
    visible: false,
  });

  const menuRef = React.useRef<any>(null);

  React.useLayoutEffect(() => {
    if (state.open && menuRef && menuRef.current) {
      dispatch({
        type: "set_menu_size",
        value: {
          width: menuRef.current.clientWidth,
          height: menuRef.current.clientHeight,
        },
      });
    }
  }, [state.open, menuRef, dispatch]);

  const ref = useCalculatedDimensions(dispatch, state);

  const open = () => dispatch({ type: "open" });

  const close = () => dispatch({ type: "close" });

  React.useEffect(() => {
    if (modalOpen) {
      close();
    }
  }, [modalOpen]);

  return { state, open, ref, dispatch, close, menuRef } as const;
};

export const Context = React.createContext<{
  state: IState;
  open: () => void;
  ref: React.MutableRefObject<any>;
  close: () => void;
  position: string;
  menuRef: React.MutableRefObject<any>;
  dispatch: React.Dispatch<IAction>;
} | null>(null);

interface DropdownProviderProps {
  reducer?: (state: IState, action: IAction) => IState;
  position: string;
}

interface DropdownComposition {
  Toggle: React.FC;
  Menu: React.FC;
}

export const DropdownProvider: React.FC<DropdownProviderProps> &
  DropdownComposition = ({ reducer = moveUpReducer, children, position }) => {
  const { state, open, ref, close, menuRef, dispatch } = useDropDown({
    reducer,
  });

  return (
    <Context.Provider
      value={{ state, open, ref, close, position, menuRef, dispatch }}
    >
      {children}
    </Context.Provider>
  );
};

export const useDropdownCtxt = () => {
  const context = React.useContext(Context)!;
  if (!context) {
    throw new Error(
      "You're using DropdownContext outside of DropdownProvider."
    );
  }
  return { ...context } as const;
};

DropdownProvider.Toggle = Toggle;
DropdownProvider.Menu = Menu;
