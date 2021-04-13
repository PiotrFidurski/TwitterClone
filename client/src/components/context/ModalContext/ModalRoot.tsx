import * as React from "react";
import { CreatePostModal } from "../../Modals/CreatePostModal";
import { EditProfileModal } from "../../Modals/EditProfileModal";
import { useLocation } from "react-router-dom";
import { CustomizeViewModal } from "../../Modals/CustomizeViewModal";
import { CreateNewMessageModal } from "../../Modals/CreateNewMessageModal";
import { useModalContext } from "./";
import { DeletePostModal } from "../../Modals/DeletePostModal";
import { UnfollowUserModal } from "../../Modals/UnfollowUserModal";
import { LoginModal } from "../../Modals/LoginModal";
import { LeaveConversationModal } from "../../Modals/LeaveConversationModal";

interface Props {
  _key: string;
  props: any;
}

export const Modals: {
  [type: string]: React.FunctionComponent<any>;
} = {
  "/posts/compose": CreatePostModal,
  "/settings/profile": EditProfileModal,
  "/i/display": CustomizeViewModal,
  "/messages/compose": CreateNewMessageModal,
};

export const AlertModals: {
  [type: string]: React.FunctionComponent<any>;
} = {
  deletePostAlert: DeletePostModal,
  unfollowUserAlert: UnfollowUserModal,
  loginAlert: LoginModal,
  leaveConversationAlert: LeaveConversationModal,
};

export const ModalRoot: React.FC<Props> = React.memo(({ _key, props }) => {
  let location = useLocation();
  const { open } = useModalContext();
  const AnyModal = Modals[location.pathname] || AlertModals[_key];

  if (AnyModal && open) {
    return <AnyModal {...props} />;
  }

  return null;
});
