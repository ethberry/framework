import React, {ComponentClass, FunctionComponent} from "react";
import {renderToStaticMarkup, renderToString} from "react-dom/server";
import {StaticRouter, StaticRouterContext} from "react-router";
import {ServerStyleSheets} from "@material-ui/styles";

import {ThemeProvider} from "@trejgun/material-ui-provider-theme";

export function renderInitialMarkup(
  url: string,
  initialState: Record<string, unknown>,
  context: StaticRouterContext,
  sheets: ServerStyleSheets,
  App: ComponentClass<any> | FunctionComponent<any>,
): string {
  return renderToString(
    sheets.collect(
      <ThemeProvider>
        <StaticRouter location={url} context={context}>
          <App state={initialState} />
        </StaticRouter>
      </ThemeProvider>,
    ),
  );
}

export function renderHTML(
  initialMarkup: string,
  initialStyles: string,
  initialState: Record<string, unknown>,
  initialLanguage: string,
  Wrapper: ComponentClass<any> | FunctionComponent<any>,
): string {
  return `<!doctype html>\n${renderToStaticMarkup(
    <Wrapper
      initialMarkup={initialMarkup}
      initialStyles={initialStyles}
      initialState={initialState}
      initialLanguage={initialLanguage}
    />,
  )}`;
}
