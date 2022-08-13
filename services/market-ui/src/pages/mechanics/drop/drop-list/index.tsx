import { FC, Fragment } from "react";
import { Grid } from "@mui/material";

import { Breadcrumbs, PageHeader, ProgressOverlay } from "@gemunion/mui-page-layout";
import { IDrop } from "@framework/types";
import { useCollection } from "@gemunion/react-hooks";

import { DropItem } from "./item";

export const DropList: FC = () => {
  const { rows, isLoading } = useCollection<IDrop>({
    baseUrl: "/drops",
  });

  return (
    <Fragment>
      <Breadcrumbs path={["dashboard", "drop-list"]} />

      <PageHeader message="pages.drop-list.title" />

      <ProgressOverlay isLoading={isLoading}>
        <Grid container spacing={2}>
          {rows.map(drop => (
            <Grid item lg={4} sm={6} xs={12} key={drop.id}>
              <DropItem drop={drop} />
            </Grid>
          ))}
        </Grid>
      </ProgressOverlay>
    </Fragment>
  );
};
