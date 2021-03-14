import * as React from "react";
import { useModalContext } from "../../context/ModalContext";
import ReactModal from "react-modal";
import { Header, Props as HeaderProps } from "./Header";
import { Content } from "./Content";

export const contentStyles = () => {
  return {
    content: {
      maxWidth: "600px",
      margin: "0 auto",
      minHeight: "180px",
      maxHeight: "90vh",
      minWidth: "0px",
      height: "auto",
      color: "var(--colors-maintext)",
      padding: 0,
      position: "relative",
      top: "5%",
      left: 0,
      display: "flex",
      flexBasis: "auto",
      flexDirection: "column",
      flexShrink: 1,
      boxSizing: "border-box",
      right: 0,
      bottom: 0,
      background: "var(--colors-mainbackground)",
      borderColor: "var(--colors-border)",
      borderRadius: "14px",
    } as any,
    overlay: {},
  };
};

interface ModalComposition {
  Header: React.FC<HeaderProps>;
  Content: React.FC;
}
interface Props {
  displayAsAlert?: boolean;
}
export const Modal: React.FC<Props> & ModalComposition = ({
  children,
  displayAsAlert,
}) => {
  const { closeModal, open } = useModalContext();
  const styles = contentStyles();

  return (
    <ReactModal
      style={
        displayAsAlert!
          ? {
              ...styles,
              content: { ...styles.content, maxWidth: "320px", top: "35%" },
            }
          : styles
      }
      isOpen={open}
      onRequestClose={closeModal}
      onAfterOpen={() => {
        document.body.style.overflowY = "hidden";
        document.body.style.margin = "0px 17px 0px 0px";
      }}
      onAfterClose={() => {
        document.body.style.overflowY = "unset";
        document.body.style.margin = "0";
      }}
      shouldCloseOnOverlayClick={true}
    >
      {children}
    </ReactModal>
  );
};

Modal.Header = Header;
Modal.Content = Content;
