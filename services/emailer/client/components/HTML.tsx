import React, { FC } from "react";

import { companyName } from "@gemunion/framework-constants-misc";

interface IHTMLProps {
  initialState: string;
  initialMarkup: string;
  initialStyles: string;
  initialLanguage: string;
}

export const HTML: FC<IHTMLProps> = ({ initialMarkup, initialStyles, initialLanguage }) => {
  return (
    <html lang={initialLanguage}>
      <head>
        <title>{companyName}</title>
        <meta charSet="utf-8" />
        <meta httpEquiv="Content-Type" content="text/html; charset=utf-8" />
        <meta name="description" content="description" />
        <meta name="keywords" content="keywords" />
        <meta name="robots" content="all" />
        <meta name="viewport" content="width=device-width, initial-scale=1, user-scalable=no" />
        <link href="/favicon.ico" rel="icon" type="image/x-icon" />
        <link href="https://fonts.googleapis.com/css?family=Roboto:300,400,500" rel="stylesheet" />
        <style id="jss-server-side" dangerouslySetInnerHTML={{ __html: initialStyles }} />
      </head>
      <body>
        <div id="app" dangerouslySetInnerHTML={{ __html: initialMarkup }} />
      </body>
    </html>
  );
};
