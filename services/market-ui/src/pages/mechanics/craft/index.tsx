import { FC, Fragment } from "react";
import { Grid, List, ListItem, ListItemText, ListSubheader, Typography } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import { FormattedMessage } from "react-intl";

import { Breadcrumbs, PageHeader, Spinner } from "@gemunion/mui-page-layout";
import { ICraft } from "@framework/types";
import { RichTextDisplay } from "@gemunion/mui-rte";
import { useCollection } from "@gemunion/react-hooks";

import { useStyles } from "./styles";
import { CraftButton } from "../../../components/buttons";
import { emptyItem, emptyPrice } from "../../../components/inputs/empty-price";

export const Craft: FC = () => {
  const { selected, isLoading } = useCollection<ICraft>({
    baseUrl: "/craft",
    empty: {
      item: emptyItem,
      ingredients: emptyPrice,
    },
  });

  const classes = useStyles();

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <Fragment>
      <Breadcrumbs path={["dashboard", "craft"]} data={[{}, selected.item.components[0].template]} />

      <PageHeader message="pages.craft.title" data={selected.item.components[0].template} />

      <Grid container>
        <Grid item xs={9}>
          <img src={selected.item.components[0].template!.imageUrl} />
          <Typography variant="body2" color="textSecondary" component="div" className={classes.preview}>
            <RichTextDisplay data={selected.item.components[0].template!.description} />
          </Typography>
        </Grid>
        <Grid item xs={3}>
          <List
            component="nav"
            subheader={
              <ListSubheader>
                <FormattedMessage id="pages.craft.ingredients" />
              </ListSubheader>
            }
          >
            {selected.ingredients.components.map(component => (
              <ListItem key={component.id} button component={RouterLink} to={`/erc1155-tokens/${component.templateId}`}>
                <ListItemText>
                  {component.template!.title} ({component.amount})
                </ListItemText>
              </ListItem>
            ))}
            <CraftButton craft={selected} />
          </List>
        </Grid>
      </Grid>
    </Fragment>
  );
};
