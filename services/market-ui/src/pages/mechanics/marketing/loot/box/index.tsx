import { FC, Fragment } from "react";
import { Grid } from "@mui/material";

import { Breadcrumbs, PageHeader, Spinner } from "@ethberry/mui-page-layout";
import { RichTextDisplay } from "@ethberry/mui-rte";
import { useCollection } from "@ethberry/provider-collection";
import { emptyStateString } from "@ethberry/draft-js-utils";
import type { ILootBox } from "@framework/types";

import { LootBoxContent } from "../token/lootbox-content";
import { LootBoxPanel } from "./loot-box-panel";
import { StyledDescription, StyledImage } from "./styled";

export const LootBox: FC = () => {
  const { selected, isLoading } = useCollection<ILootBox>({
    baseUrl: "/loot/boxes",
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
      <Breadcrumbs path={["dashboard", "loot", "loot.box"]} data={[{}, {}, selected]} />

      <PageHeader message="pages.loot.box.title" data={selected} />

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
