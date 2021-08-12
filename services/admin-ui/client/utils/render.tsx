import React, { ComponentClass, FunctionComponent } from "react";
import * as ReactDOM from "react-dom";
import { Router } from "react-router-dom";
import { ThemeProvider } from "@gemunionstudio/material-ui-provider-theme";
import { history } from "@gemunionstudio/history";

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
