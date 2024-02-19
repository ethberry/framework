import { FC, Fragment } from "react";
import { Grid, Typography } from "@mui/material";

import { Breadcrumbs, PageHeader, Spinner } from "@gemunion/mui-page-layout";
import { RichTextDisplay } from "@gemunion/mui-rte";
import { useCollection } from "@gemunion/react-hooks";
import { emptyStateString } from "@gemunion/draft-js-utils";
import type { IMysteryBox } from "@framework/types";

import { MysteryBoxContent } from "../token/mysterybox-content";
import { MysteryBoxPanel } from "./mystery-box-panel";
import { StyledImage } from "./styled";

export const MysteryBox: FC = () => {
  const { selected, isLoading } = useCollection<IMysteryBox>({
    baseUrl: "/mystery/boxes",
    empty: {
      title: "",
      description: emptyStateString,
      item: {
        id: 0,
        components: [],
      },
    },
  });

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <Fragment>
      <Breadcrumbs path={["dashboard", "mystery", "mystery.box"]} data={[{}, {}, selected]} />

      <PageHeader message="pages.mystery.box.title" data={selected} />

      <Grid container>
        <Grid item xs={12} sm={9}>
          <StyledImage component="img" src={selected.imageUrl} />
          <Typography variant="body2" color="textSecondary" component="div">
            <RichTextDisplay data={selected.description} />
          </Typography>
        </Grid>
        <Grid item xs={12} sm={3}>
          {selected.templateId ? (
            <>
              <MysteryBoxPanel box={selected} />
            </>
          ) : null}
        </Grid>

        <Grid item xs={3}></Grid>
      </Grid>

      <MysteryBoxContent mysteryBox={selected} />
    </Fragment>
  );
};
