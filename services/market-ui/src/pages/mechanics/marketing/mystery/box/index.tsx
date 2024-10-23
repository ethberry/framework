import { FC, Fragment } from "react";
import { Grid } from "@mui/material";

import { Breadcrumbs, PageHeader, Spinner } from "@ethberry/mui-page-layout";
import { RichTextDisplay } from "@ethberry/mui-rte";
import { useCollection } from "@ethberry/provider-collection";
import { emptyStateString } from "@ethberry/draft-js-utils";
import type { IMysteryBox } from "@framework/types";

import { MysteryBoxContent } from "../token/mystery-box-content";
import { MysteryBoxPanel } from "./mystery-box-panel";
import { StyledDescription, StyledImage } from "./styled";

export const MysteryBox: FC = () => {
  const { selected, isLoading } = useCollection<IMysteryBox>({
    baseUrl: "/mystery/boxes",
    empty: {
      title: "",
      description: emptyStateString,
      content: {
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
          <StyledDescription component="div">
            <RichTextDisplay data={selected.description} />
          </StyledDescription>
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
