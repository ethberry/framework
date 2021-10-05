import React, { ComponentClass, FunctionComponent } from "react";
import * as ReactDOM from "react-dom";
import { Router } from "react-router-dom";
import { GemunionThemeProvider } from "@gemunion/mui-provider-theme";
import { history } from "@gemunion/history";

export default (App: ComponentClass<any> | FunctionComponent<any>): void => {
  ReactDOM.render(
    <GemunionThemeProvider>
      <Router history={history}>
        <App />
      </Router>
    </GemunionThemeProvider>,
    document.getElementById("app"),
  );
};
