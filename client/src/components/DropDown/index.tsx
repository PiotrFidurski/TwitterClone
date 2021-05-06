import * as React from "react";
import { Menu } from "./DropDownComposition/Menu";
import { Toggle } from "./DropDownComposition/Toggle";
import { IAction, IState, baseReducer } from "./reducers";
import { useDropDown } from "./useDropDown";

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
  DropdownComposition = ({ reducer = baseReducer, children, position }) => {
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
