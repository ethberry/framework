import {Request, Response} from "express";
import {ServerStyleSheets} from "@material-ui/styles";
import {StaticRouterContext} from "react-router";

import {DefaultLanguage} from "@gemunionstudio/solo-constants-misc";
import {i18n} from "@gemunionstudio/solo-localization-emailer";
import {fakeToken, fakeUser} from "@gemunionstudio/solo-mocks";

import {HTML} from "../../client/components/HTML";
import {renderHTML, renderInitialMarkup} from "./render";
import {App} from "../../client/pages";

export function renderAppToString(request: Request, response: Response): void {
  // const initialLanguage = request.isAuthenticated() ? request.user.language : DefaultLanguage;
  const initialLanguage = DefaultLanguage;

  const initialState = {
    intl: {
      locale: initialLanguage,
      i18n,
    },
    user: fakeUser,
    data: {
      token: fakeToken,
      baseUrl: "http://localhost:3000",
    },
  };

  const context: StaticRouterContext = {};
  const sheets = new ServerStyleSheets();

  const initialMarkup = renderInitialMarkup(request.url, initialState, context, sheets, App);
  const initialStyles = sheets.toString();

  // context.url will contain the URL to redirect to if a <Redirect> was used
  if (context.url) {
    response.redirect(302, context.url);
  } else {
    response.status(200).send(renderHTML(initialMarkup, initialStyles, initialState, initialLanguage, HTML));
  }
}

export function renderEmptyString(_request: Request, response: Response): void {
  const initialLanguage = DefaultLanguage;
  response.status(200).send(
    renderHTML(
      "",
      "",
      {
        intl: {
          locale: initialLanguage,
          i18n,
        },
      },
      DefaultLanguage,
      HTML,
    ),
  );
}
