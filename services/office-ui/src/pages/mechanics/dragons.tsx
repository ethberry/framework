import { FC, Fragment } from "react";
import { FormattedMessage } from "react-intl";

import { Breadcrumbs, PageHeader } from "@ethberry/mui-page-layout";

export const Dragons: FC = () => {
  return (
    <Fragment>
      <Breadcrumbs path={["dashboard", "dragons"]} />

      <PageHeader message="pages.dragons.title" />

      <FormattedMessage id="pages.dragons.description" />
    </Fragment>
  );
};
