import {ServerStyleSheets} from "@material-ui/styles";
import {StaticRouterContext} from "react-router";

import {EmailType, IUser} from "@gemunionstudio/solo-types";
import {DefaultLanguage} from "@gemunionstudio/solo-constants-misc";
import {i18n} from "@gemunionstudio/solo-localization-emailer";

import {EML} from "../../client/components/EML";
import {renderHTML, renderInitialMarkup} from "./render";
import {App} from "../../client/pages";

export function renderEmailToString(type: EmailType, {user, ...data}: {user: IUser}): Promise<string> {
  const initialLanguage = user.language || DefaultLanguage;

  const initialState = {
    intl: {
      locale: initialLanguage,
      i18n,
    },
    user,
    data,
  };

  return new Promise((resolve, reject): void => {
    const context: StaticRouterContext = {};
    const sheets = new ServerStyleSheets();

    const initialMarkup = renderInitialMarkup(`/${type}`, initialState, context, sheets, App);
    const initialStyles = sheets.toString();

    if (context.url) {
      reject(new Error("emailNotFound"));
    } else {
      resolve(renderHTML(initialMarkup, initialStyles, initialState, initialLanguage, EML));
    }
  });
}
