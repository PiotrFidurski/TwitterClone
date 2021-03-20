import * as React from "react";
import ReactDOM from "react-dom";
import { ApolloProvider } from "@apollo/client";
import { BrowserRouter } from "react-router-dom";
import { App } from "./components/App";
import { client } from "./client";
import Modal from "react-modal";
import "./index.css";
import "emoji-mart/css/emoji-mart.css";

Modal.setAppElement("#root");

ReactDOM.render(
  <BrowserRouter>
    <ApolloProvider client={client}>
      <App />
    </ApolloProvider>
  </BrowserRouter>,
  document.getElementById("root")
);
