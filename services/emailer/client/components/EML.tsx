import React, {FC} from "react";

import {companyName} from "@gemunionstudio/solo-constants-misc";

interface IEMLProps {
  initialMarkup: string;
  initialStyles: string;
}

export const EML: FC<IEMLProps> = ({initialMarkup, initialStyles}) => {
  return (
    <html>
      <head>
        <title>{companyName}</title>
        <link href="https://fonts.googleapis.com/css?family=Roboto:300,400,500" rel="stylesheet" />
        <style id="jss-server-side" dangerouslySetInnerHTML={{__html: initialStyles}} />
      </head>
      <body>
        <div id="app" dangerouslySetInnerHTML={{__html: initialMarkup}} />
      </body>
    </html>
  );
};
