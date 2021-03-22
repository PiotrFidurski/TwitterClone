import * as React from "react";
import { useLocation } from "react-router-dom";
import { useModalContext } from "../../components/context/ModalContext";
import { Modals } from "../../components/context/ModalContext/ModalRoot";
import { LoadingPage } from "../../pages/LoadingPage";
import { useQuery } from "@apollo/client";
import { AuthUserDocument } from "../../generated/introspection-result";
import { UserConversationsDocument } from "../../generated/graphql";
const NonAuthenticatedRoutes = React.lazy(
  () => import("./NonAuthenticatedRoutes")
);
const HomePage = React.lazy(() => import("../../pages/HomePage"));

export const Routes = () => {
  const location = useLocation();
  const { openModal } = useModalContext();
  const { data, loading } = useQuery(AuthUserDocument, {
    fetchPolicy: "network-only",
    nextFetchPolicy: "cache-only",
  });
  useQuery(UserConversationsDocument);

  const isModalAtLocation = !!Modals[location.pathname];

  React.useEffect(() => {
    if (!loading && data && isModalAtLocation) {
      openModal();
    }
  }, [location, loading, data, isModalAtLocation, openModal]);

  if (loading) return <LoadingPage />;

  return (
    <React.Suspense fallback={<LoadingPage />}>
      {data! && !!data!.authUser.name ? (
        <HomePage user={data!.authUser!} />
      ) : (
        <NonAuthenticatedRoutes />
      )}
    </React.Suspense>
  );
};
