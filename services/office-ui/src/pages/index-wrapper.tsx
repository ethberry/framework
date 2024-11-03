import { FC, PropsWithChildren } from "react";
import { Grid } from "@mui/material";

import { Breadcrumbs, PageHeader } from "@ethberry/mui-page-layout";

export interface IIndexWrapperProps {
  index: string;
}

export const IndexWrapper: FC<PropsWithChildren<IIndexWrapperProps>> = props => {
  const { children, index } = props;
  return (
    <Grid>
      <Breadcrumbs path={["dashboard", index]} />

      <PageHeader message={`pages.${index}.title`} />

      {children}
    </Grid>
  );
};
