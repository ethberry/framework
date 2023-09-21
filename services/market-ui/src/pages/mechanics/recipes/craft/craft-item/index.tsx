import { FC, Fragment } from "react";
import { Box, Grid, Typography } from "@mui/material";

import { Breadcrumbs, PageHeader, Spinner } from "@gemunion/mui-page-layout";
import { RichTextDisplay } from "@gemunion/mui-rte";
import { useCollection } from "@gemunion/react-hooks";
import { emptyItem, emptyPrice } from "@gemunion/mui-inputs-asset";
import type { ICraft } from "@framework/types";

import { CraftTransactions } from "./transactions";
import { CraftItemPanel } from "../craft-item-panel";

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
        data={[{}, {}, selected.item?.components[0].template]}
      />

      <PageHeader
        message="pages.recipes.craft.title"
        data={{ title: selected.item?.components.map(comp => comp.template?.title).join(" + ") }}
      />

      <Grid container>
        <Grid item xs={12} sm={9}>
          {selected.item?.components.map(component => {
            return (
              <Box
                key={component.template!.id}
                component="img"
                src={component.template!.imageUrl}
                // TODO FIXME - make a better grid of multiple items
                // TODO use MUI native multi-image list?
                // https://mui.com/material-ui/react-image-list/ or
                // https://mui.com/material-ui/react-masonry/
                alt="Gemunion template image"
                sx={{
                  display: "block",
                  mx: "auto",
                  maxWidth: `${70 / componentsLength}%`,
                }}
              />
            );
          })}
          <Typography variant="body2" color="textSecondary" component="div">
            <RichTextDisplay data={selected.item?.components[0].template!.description} />
          </Typography>
        </Grid>
        <Grid item xs={12} sm={3}>
          <CraftItemPanel craft={selected} />
        </Grid>
      </Grid>

      <br />

      {selected.id ? <CraftTransactions craft={selected} /> : null}
    </Fragment>
  );
};
