import { FC, Fragment } from "react";
import { Grid, Typography } from "@mui/material";

import { Breadcrumbs, PageHeader, Spinner } from "@gemunion/mui-page-layout";
import { RichTextDisplay } from "@gemunion/mui-rte";
import { useCollection } from "@gemunion/react-hooks";
import { emptyStateString } from "@gemunion/draft-js-utils";
import type { ILootBox } from "@framework/types";

import { LootBoxContent } from "../token/lootbox-content";
import { LootBoxPanel } from "./loot-box-panel";
import { StyledImage } from "./styled";

export const LootBox: FC = () => {
  const { selected, isLoading } = useCollection<ILootBox>({
    baseUrl: "/loot/boxes",
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
      <Breadcrumbs path={["dashboard", "loot", "loot.box"]} data={[{}, {}, selected]} />

      <PageHeader message="pages.loot.box.title" data={selected} />

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
              <LootBoxPanel box={selected} />
            </>
          ) : null}
        </Grid>

        <Grid item xs={3}></Grid>
      </Grid>

      <LootBoxContent lootBox={selected} />
    </Fragment>
  );
};
