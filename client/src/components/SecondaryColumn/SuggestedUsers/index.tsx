import { useQuery } from "@apollo/client";
import * as React from "react";
import {
  RandomUsersDocument,
  RandomUsersQuery,
  User,
} from "../../../generated/graphql";
import { Spinner, SpanContainer, ButtonContainer } from "../../../styles";
import { StyledHoverWrapper } from "../styles";
import { StyledContainer, StyledHeader } from "./styles";
import { UserToFollow } from "./UserToFollow";

interface Props {
  user: User;
}

export const SuggestedUsers: React.FC<Props> = React.memo(
  ({ user }) => {
    const { data, loading, refetch } = useQuery<RandomUsersQuery>(
      RandomUsersDocument,
      {
        variables: { userId: user!.id! },
      }
    );

    return (
      <StyledContainer>
        {loading ? (
          <Spinner bigMargin />
        ) : (
          <div>
            <StyledHoverWrapper>
              <StyledHeader>
                <SpanContainer bigger bolder>
                  <span>Who to Follow</span>
                </SpanContainer>
              </StyledHeader>
            </StyledHoverWrapper>
            {data &&
              data!.randomUsers!.map((user) => {
                return <UserToFollow key={user.id} userToFollow={user} />;
              })}
            <div style={{ padding: "10px 15px 10px 15px" }}>
              <ButtonContainer
                onClick={() => {
                  refetch({ variables: { userId: user!.id! } });
                }}
              >
                <div>
                  <SpanContainer>
                    <span>Refresh</span>
                  </SpanContainer>
                </div>
              </ButtonContainer>
            </div>
          </div>
        )}
      </StyledContainer>
    );
  },
  (prevProps, nextProps) => prevProps.user!.id === nextProps.user.id
);
