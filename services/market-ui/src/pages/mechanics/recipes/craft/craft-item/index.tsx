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
    baseUrl: "/craft",
    empty: {
      item: emptyItem,
      price: emptyPrice,
    },
  });

  if (isLoading) {
    return <Spinner />;
  }

  const recipeLength = selected.item?.components.length;

  // Should never happen
  if (!recipeLength) {
    return null;
  }

  return (
    <Fragment>
      <Breadcrumbs path={["dashboard", "craft"]} data={[{}, selected.item?.components[0].template]} />

      <PageHeader
        message="pages.craft.title"
        data={{ title: selected.item?.components.map(comp => comp.template?.title).join(" + ") }}
      />

      <Grid container>
        <Grid item xs={12} sm={9}>
          {selected.item?.components.map(comp => {
            return (
              <Box
                key={comp.id}
                component="img"
                src={comp.template!.imageUrl}
                // TODO FIXME - make a better grid of multiple items
                // TODO use MUI native multi-image list?
                // https://mui.com/material-ui/react-image-list/ or
                // https://mui.com/material-ui/react-masonry/
                alt="Gemunion template image"
                sx={{
                  display: "block",
                  mx: "auto",
                  maxWidth: `${70 / recipeLength}%`,
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
