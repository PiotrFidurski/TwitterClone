import * as React from "react";
import { useModalContext } from "../context/ModalContext";
import { baseReducer } from "./reducers";
import { useDimensions } from "./useDimensions";

export const useDropDown = ({ reducer = baseReducer } = {}) => {
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

  const ref = useDimensions(dispatch, state);

  const open = () => dispatch({ type: "open" });

  const close = () => dispatch({ type: "close" });

  React.useEffect(() => {
    if (modalOpen) {
      close();
    }
  }, [modalOpen]);

  return { state, open, ref, dispatch, close, menuRef } as const;
};
