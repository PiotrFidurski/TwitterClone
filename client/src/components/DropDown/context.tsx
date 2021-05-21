import * as React from "react";
import { Menu } from "./DropDownComposition/Menu";
import { Toggle } from "./DropDownComposition/Toggle";
import { IAction, IState, baseReducer, actionTypes } from "./reducers";
import { useSetupDropdown } from "./hooks/useSetupDropdown";

interface DropdownContextProps {
  state: IState;
  dispatch: React.Dispatch<IAction>;
  menuRef: React.MutableRefObject<HTMLDivElement | null>;
  toggleRef: React.MutableRefObject<HTMLDivElement | null>;
}

export const DropdownContext =
  React.createContext<DropdownContextProps | null>(null);

interface DropdownProviderProps {
  reducer?: (state: IState, action: IAction) => IState;
}

interface DropdownComposition {
  Toggle: React.FC;
  Menu: React.FC<{ position: string }>;
}

export const DropdownProvider: React.FC<DropdownProviderProps> &
  DropdownComposition = ({ reducer = baseReducer, children, ...props }) => {
  const value = useSetupDropdown({
    reducer,
  });

  return (
    <DropdownContext.Provider value={value} {...props}>
      {children}
    </DropdownContext.Provider>
  );
};

export const useDropdown = () => {
  const context = React.useContext(DropdownContext)!;
  if (!context) {
    throw new Error(
      "You're using DropdownContext outside of DropdownProvider."
    );
  }
  return context;
};

export const open = (dispatch: React.Dispatch<IAction>) =>
  dispatch({ type: actionTypes.open });

export const close = (dispatch: React.Dispatch<IAction>) =>
  dispatch({ type: actionTypes.close });

DropdownProvider.Toggle = Toggle;
DropdownProvider.Menu = Menu;
