import React, {FC, Fragment} from "react";

import {PageHeader} from "@trejgun/material-ui-page-header";

export const AboutUs: FC = () => {
  return (
    <Fragment>
      <PageHeader message="pages.about-us.title" />

      <p>Some text</p>
    </Fragment>
  );
};
