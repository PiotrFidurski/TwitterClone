import * as React from "react";
import { Switch, Route } from "react-router-dom";
import { Home } from "../../components/Home";
import { BaseStylesDiv } from "../../styles";
import { LoginPage } from "../../pages/LoginPage";
import { SignUpPage } from "../../pages/SignUpPage";

interface Props {}

const NonAuthenticatedRoutes: React.FC<Props> = () => {
  return (
    <BaseStylesDiv flexGrow>
      <Switch>
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
      </Switch>
    </BaseStylesDiv>
  );
};

export default NonAuthenticatedRoutes;
