import { FC } from "react";
import { Grid } from "@mui/material";

import { emptyItem } from "@ethberry/mui-inputs-asset";
import { Breadcrumbs, PageHeader, Spinner } from "@ethberry/mui-page-layout";
import { RichTextDisplay } from "@ethberry/mui-rte";
import { useCollection } from "@ethberry/provider-collection";
import type { IMerge } from "@framework/types";

import { MergeItemPanel } from "../merge-item-panel";
import { StyledDescription, StyledImage } from "./styled";

export const MergeItem: FC = () => {
  const { selected, isLoading } = useCollection<IMerge>({
    baseUrl: "/recipes/merge",
    empty: {
      item: emptyItem,
      price: emptyItem,
    },
  });

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <Grid>
      <Breadcrumbs
        path={["dashboard", "recipes", "recipes.merge"]}
        data={[{}, {}, { title: selected.item?.components[0].template?.title }]}
      />

      <PageHeader message="pages.recipes.merge.title" data={{ title: selected.item?.components[0].template?.title }} />

      <Grid container>
        <Grid item xs={12} sm={9}>
          <StyledImage component="img" src={selected.item?.components[0].template!.imageUrl} />
          <StyledDescription component="div">
            <RichTextDisplay data={selected.item?.components[0].template!.description} />
          </StyledDescription>
        </Grid>
        <Grid item xs={12} sm={3}>
          <MergeItemPanel merge={selected} />
        </Grid>
      </Grid>

      <StyledDescription component="div">
        <RichTextDisplay data={selected.item?.components[0].template!.description} />
      </StyledDescription>
    </Grid>
  );
};
