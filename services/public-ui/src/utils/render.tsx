import { ComponentClass, FunctionComponent } from "react";
import { render } from "react-dom";
import { unstable_HistoryRouter as HistoryRouter } from "react-router-dom";

import { GemunionThemeProvider } from "@gemunion/mui-provider-theme";
import { history } from "@gemunion/history";

export default (App: ComponentClass<any> | FunctionComponent<any>): void => {
  render(
    <GemunionThemeProvider>
      <HistoryRouter history={history}>
        <App />
      </HistoryRouter>
    </GemunionThemeProvider>,
    document.getElementById("app"),
  );
};
