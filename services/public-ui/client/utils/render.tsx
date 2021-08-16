import React, { ComponentClass, FunctionComponent } from "react";
import * as ReactDOM from "react-dom";
import { Router } from "react-router-dom";
import { ThemeProvider } from "@gemunion/material-ui-provider-theme";
import { history } from "@gemunion/history";

export default (App: ComponentClass<any> | FunctionComponent<any>): void => {
  ReactDOM.render(
    <ThemeProvider>
      <Router history={history}>
        <App />
      </Router>
    </ThemeProvider>,
    document.getElementById("app"),
  );
};
