import * as React from "react";
import { Switch, Route, useLocation } from "react-router-dom";
import { Home } from "../../components/Home";
import { BaseStylesDiv } from "../../styles";
import { LoginPage } from "../../pages/LoginPage";
import { SignUpPage } from "../../pages/SignUpPage";
import { CustomizeViewModal } from "../../components/Modals/CustomizeViewModal";

const NonAuthenticatedRoutes: React.FC = () => {
  let location = useLocation<{ isModalLocaction: any }>();

  return (
    <BaseStylesDiv flexGrow>
      <Switch location={location.state?.isModalLocaction || location}>
        <Route exact path="/login">
          <LoginPage />
        </Route>
        <Route exact path="/register">
          <SignUpPage />
        </Route>
        <Route path="/">
          <Home />
        </Route>
        <Route path="/home">
          <Home />
        </Route>
        <Route exact path="/i/display">
          <CustomizeViewModal />
        </Route>
      </Switch>
    </BaseStylesDiv>
  );
};

export default NonAuthenticatedRoutes;
