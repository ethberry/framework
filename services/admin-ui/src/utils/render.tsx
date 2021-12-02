import { ComponentClass, FunctionComponent } from "react";
import { render } from "react-dom";
import { BrowserRouter } from "react-router-dom";

import { GemunionThemeProvider } from "@gemunion/mui-provider-theme";

export default (App: ComponentClass<any> | FunctionComponent<any>): void => {
  render(
    <GemunionThemeProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </GemunionThemeProvider>,
    document.getElementById("app"),
  );
};
