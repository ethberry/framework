import { FC, Fragment } from "react";
import { Box, Grid } from "@mui/material";

import { IMerge } from "@framework/types";
import { emptyItem } from "@gemunion/mui-inputs-asset";
import { Breadcrumbs, PageHeader, Spinner } from "@gemunion/mui-page-layout";
import { RichTextDisplay } from "@gemunion/mui-rte";
import { useCollection } from "@gemunion/react-hooks";

import { MergeItemPanel } from "../merge-item-panel";
import { StyledDescription, StyledImageList, StyledImageListItem } from "./styled";

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
    <Fragment>
      <Breadcrumbs
        path={["dashboard", "recipes", "recipes.merge"]}
        data={[{}, {}, { title: selected.item?.components.map(comp => comp.template?.title).join(" + ") }]}
      />

      <PageHeader
        message="pages.recipes.merge.title"
        data={{ title: selected.item?.components.map(comp => comp.template?.title).join(" + ") }}
      />

      <Grid container>
        <Grid item xs={12} sm={9}>
          <StyledImageList count={selected.item?.components.length || 1}>
            {selected.item?.components.map(component => {
              return (
                <StyledImageListItem key={component.template!.id}>
                  <Box component="img" src={component.template!.imageUrl} alt="Gemunion template image" />
                </StyledImageListItem>
              );
            })}
          </StyledImageList>
        </Grid>
        <Grid item xs={12} sm={3}>
          <MergeItemPanel merge={selected} />
        </Grid>
      </Grid>

      <StyledDescription>
        <RichTextDisplay data={selected.item?.components[0].template!.description} />
      </StyledDescription>
    </Fragment>
  );
};
