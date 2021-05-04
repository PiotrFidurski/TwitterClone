import * as React from "react";
import { useHistory } from "react-router-dom";
import { ModalRoot } from "./ModalRoot";
import { Location } from "history";

interface ModalContextProps {
  open: boolean;
  openModal: (key?: string, props?: any) => void;
  closeModal: () => void;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export const ModalContext = React.createContext<ModalContextProps | null>(null);

export const ModalProvider: React.FC = React.memo(({ children }) => {
  const [open, setOpen] = React.useState(false);
  const [alertDialog, setAlertDialog] = React.useState({ _key: "", props: {} });
  let history = useHistory();

  let state = history.location.state as { isModal: Location };

  const openModal = React.useCallback((key?: string, props?: any) => {
    setAlertDialog({ _key: key!, props: { ...props! } });
    setOpen(true);
  }, []);

  const closeModal = React.useCallback(() => {
    setOpen(false);
    if (!state && !alertDialog._key) {
      return history.push("/home");
    }

    if (state && state.isModal && state.isModal.pathname !== "/home") {
      return history.goBack();
    }

    return !alertDialog._key ? history.goBack() : null;
  }, [history, state, alertDialog]);

  return (
    <ModalContext.Provider value={{ open, openModal, closeModal, setOpen }}>
      {children}
      <ModalRoot {...alertDialog} />
    </ModalContext.Provider>
  );
});

export const useModalContext = () => {
  const context = React.useContext(ModalContext);

  if (!context) {
    throw new Error("You're using ModalContext outside of ModalProvider.");
  }

  return { ...context };
};
