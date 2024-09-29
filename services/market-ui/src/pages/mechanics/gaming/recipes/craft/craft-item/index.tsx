import { FC, Fragment } from "react";
import { Box, Grid } from "@mui/material";

import { Breadcrumbs, PageHeader, Spinner } from "@ethberry/mui-page-layout";
import { RichTextDisplay } from "@ethberry/mui-rte";
import { useCollection } from "@ethberry/provider-collection";
import { emptyItem, emptyPrice } from "@ethberry/mui-inputs-asset";
import type { ICraft } from "@framework/types";

import { CraftTransactions } from "./transactions";
import { CraftItemPanel } from "../craft-item-panel";
import { StyledDescription, StyledImageList, StyledImageListItem } from "./styled";

export const CraftItem: FC = () => {
  const { selected, isLoading } = useCollection<ICraft>({
    baseUrl: "/recipes/craft",
    empty: {
      item: emptyItem,
      price: emptyPrice,
    },
  });

  if (isLoading) {
    return <Spinner />;
  }

  const componentsLength = selected.item?.components.length;

  // Should never happen
  if (!componentsLength) {
    return null;
  }

  return (
    <Fragment>
      <Breadcrumbs
        path={["dashboard", "recipes", "recipes.craft"]}
        data={[{}, {}, { title: selected.item?.components.map(comp => comp.template?.title).join(" + ") }]}
      />

      <PageHeader
        message="pages.recipes.craft.title"
        data={{ title: selected.item?.components.map(comp => comp.template?.title).join(" + ") }}
      />

      <Grid container>
        <Grid item xs={12} sm={9}>
          <StyledImageList count={selected.item?.components.length || 1}>
            {selected.item?.components.map(component => {
              return (
                <StyledImageListItem key={component.template!.id}>
                  <Box component="img" src={component.template!.imageUrl} alt={component.template!.title} />
                </StyledImageListItem>
              );
            })}
          </StyledImageList>
        </Grid>
        <Grid item xs={12} sm={3}>
          <CraftItemPanel craft={selected} />
        </Grid>
      </Grid>

      <StyledDescription>
        <RichTextDisplay data={selected.item?.components[0].template!.description} />
      </StyledDescription>

      {selected.id ? <CraftTransactions craft={selected} /> : null}
    </Fragment>
  );
};
