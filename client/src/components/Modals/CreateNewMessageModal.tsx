import { useMutation, useQuery } from "@apollo/client";
import * as React from "react";
import {
  AuthUserDocument,
  AuthUserQuery,
  SuggestedUsersDocument,
  SuggestedUsersQuery,
} from "../../generated/graphql";
import {
  BaseStylesDiv,
  SpanContainer,
  ButtonContainer,
  Absolute,
  HoverContainer,
  BaseStyles,
  Spinner,
  AvatarContainer,
  StyledAvatar,
} from "../../styles";
import { ReactComponent as Close } from "../svgs/Close.svg";
import { Modal } from "./ModalComposition/Modal";

export const CreateNewMessageModal: React.FC = () => {
  const { data, loading } = useQuery<SuggestedUsersQuery>(
    SuggestedUsersDocument
  );
  const { data: authUser } = useQuery<AuthUserQuery>(AuthUserDocument);
  const [userIds, setUserIds] = React.useState<Array<string>>([]);
  // const [createGroupDm] = useMutation<AddPeopleToConversationMutation>(
  //   AddPeopleToConversationDocument,
  //   { variables: { userIds: [...userIds] } }
  // );
  const thread: any = React.useMemo(() => [], []);

  React.useEffect(() => {
    if (data && data!.suggestedUsers) {
      data!.suggestedUsers!.forEach((user) => (thread[user!.id] = user));
    }
  }, [data, loading, thread]);

  const addToList = (userId: string) => {
    if (userIds.includes(userId)) {
      const newIds = userIds.filter((id) => id !== userId);
      setUserIds(newIds);
    } else {
      setUserIds((userIds) => [...userIds, userId]);
    }
  };

  return (
    <>
      <Modal>
        <Modal.Header>
          {({ closeModal }) => (
            <BaseStylesDiv flexGrow>
              <BaseStylesDiv
                flexGrow
                style={{ justifyContent: "flex-start", alignItems: "center" }}
              >
                <BaseStylesDiv style={{ marginRight: "20px" }}>
                  <HoverContainer>
                    <Absolute onClick={closeModal} />
                    <Close />
                  </HoverContainer>
                </BaseStylesDiv>
                <BaseStylesDiv>
                  <SpanContainer bolder bigger>
                    New Message
                  </SpanContainer>
                </BaseStylesDiv>
              </BaseStylesDiv>
              <BaseStylesDiv style={{ alignSelf: "flex-end" }}>
                <ButtonContainer
                  filledVariant
                  onClick={async () => {
                    try {
                      if (userIds.length) {
                        // await createGroupDm();
                        closeModal();
                      }

                      closeModal();
                    } catch (error) {
                      console.log(error);
                    }
                  }}
                >
                  <SpanContainer bold>
                    <span>Next</span>
                  </SpanContainer>
                </ButtonContainer>
              </BaseStylesDiv>
            </BaseStylesDiv>
          )}
        </Modal.Header>
        <Modal.Content>
          {!data && loading ? (
            <Spinner />
          ) : (
            <BaseStylesDiv flexColumn style={{ overflow: "auto" }}>
              <BaseStylesDiv
                flexGrow
                style={{
                  padding: "15px 15px",
                  borderBottom: "1px solid var(--colors-border)",
                  alignItems: "center",
                  justifyContent: "flex-start",
                  flexWrap: "wrap",
                  width: "100%",
                }}
              >
                {userIds && userIds.length
                  ? userIds.map((id) => (
                      <BaseStylesDiv style={{ padding: "0px 10px 5px 0" }}>
                        <ButtonContainer
                          onClick={() => addToList(id)}
                          noPadding
                          noMarginLeft
                          style={{ minWidth: "30xp", minHeight: "30px" }}
                        >
                          <div>
                            <BaseStylesDiv
                              flexGrow
                              style={{
                                alignItems: "center",
                                padding: "0px 3px",
                              }}
                            >
                              <AvatarContainer
                                width={25}
                                height={"25px"}
                                noRightMargin
                              >
                                <StyledAvatar
                                  url={thread[id].avatar}
                                ></StyledAvatar>
                              </AvatarContainer>
                              <SpanContainer
                                style={{
                                  color: "white",
                                  margin: "0px 10px 0px 10px",
                                }}
                              >
                                <span>{thread[id].username}</span>
                              </SpanContainer>
                              <BaseStylesDiv>
                                <Close fill="var(--colors-button)" />
                              </BaseStylesDiv>
                            </BaseStylesDiv>
                          </div>
                        </ButtonContainer>
                      </BaseStylesDiv>
                    ))
                  : null}
              </BaseStylesDiv>
              {data && !loading
                ? data!
                    .suggestedUsers!.filter(
                      (user) => user.id !== authUser!.authUser!.id
                    )
                    .map((user) => (
                      <BaseStylesDiv
                        key={user.id}
                        onClick={() => addToList(user.id)}
                      >
                        <BaseStylesDiv
                          flexGrow
                          style={{
                            padding: "10px 15px",
                            borderBottom: "1px solid var(--colors-border)",
                          }}
                        >
                          <BaseStylesDiv flexGrow>
                            <AvatarContainer width={30} height={"30px"}>
                              <StyledAvatar url={user.avatar}></StyledAvatar>
                            </AvatarContainer>

                            <SpanContainer bigger bold>
                              <span>{user.username}</span>
                            </SpanContainer>
                          </BaseStylesDiv>
                        </BaseStylesDiv>
                      </BaseStylesDiv>
                    ))
                : null}
            </BaseStylesDiv>
          )}
        </Modal.Content>
      </Modal>
    </>
  );
};
