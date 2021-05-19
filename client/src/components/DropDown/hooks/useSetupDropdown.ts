import * as React from "react";
import { useModalContext } from "../../context/ModalContext";
import { actionTypes, baseReducer } from "../reducers";
import { useDimensions } from "./useDimensions";

export const useSetupDropdown = ({ reducer = baseReducer } = {}) => {
  const { open: modalOpen } = useModalContext();

  const [state, dispatch] = React.useReducer(reducer, {
    open: false,
    dimensions: undefined,
    width: 0,
    height: 0,
  });

  const menuRef = React.useRef<HTMLDivElement | null>(null);

  const toggleRef = useDimensions(state, dispatch);

  React.useLayoutEffect(() => {
    if (state.open)
      dispatch({
        type: actionTypes.setMenuSize,
        value: {
          width: menuRef?.current?.clientWidth,
          height: menuRef?.current?.clientHeight,
        },
      });
  }, [state.open]);

  React.useEffect(() => {
    if (modalOpen) {
      dispatch({ type: actionTypes.close });
    }
  }, [modalOpen]);

  return { state, dispatch, menuRef, toggleRef } as const;
};
