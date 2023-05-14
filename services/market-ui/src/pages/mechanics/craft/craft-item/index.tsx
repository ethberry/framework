import { FC, Fragment } from "react";
import { Box, Grid, List, ListItem, ListItemText, Paper, Typography } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import { FormattedMessage } from "react-intl";
import { emptyStateString } from "@gemunion/draft-js-utils";

import { Breadcrumbs, PageHeader, Spinner } from "@gemunion/mui-page-layout";
import { RichTextDisplay } from "@gemunion/mui-rte";
import { useCollection } from "@gemunion/react-hooks";
import { emptyItem, emptyPrice } from "@gemunion/mui-inputs-asset";
import { imageUrl } from "@framework/constants";

import { ICraft, TokenType } from "@framework/types";

import { useStyles } from "./styles";
import { CraftButton } from "../../../../components/buttons";

export const CraftItem: FC = () => {
  const { selected, isLoading } = useCollection<ICraft>({
    baseUrl: "/craft",
    empty: {
      item: emptyItem,
      price: emptyPrice,
    },
  });
  // TODO better empty template and empty price?
  if (selected.item?.components[0] && selected.price?.components[0] && !selected.item?.components[0].template) {
    Object.assign(selected.item?.components[0], {
      template: {
        title: "",
        description: emptyStateString,
        imageUrl,
      },
      contract: {
        contractType: TokenType.ERC721,
      },
    });
    Object.assign(selected.price?.components[0], {
      id: 0,
      template: {
        imageUrl,
      },
      contract: {
        contractType: TokenType.ERC1155,
      },
    });
  }

  const classes = useStyles();

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <Fragment>
      <Breadcrumbs path={["dashboard", "craft"]} data={[{}, selected.item?.components[0].template]} />

      <PageHeader message="pages.craft.title" data={selected.item?.components[0].template} />

      <Grid container>
        <Grid item xs={12} sm={9}>
          <Box
            component="img"
            sx={{ maxWidth: "100%" }}
            src={selected.item?.components[0].template!.imageUrl}
            alt="Gemunion template image"
          />
          <Typography variant="body2" color="textSecondary" component="div" className={classes.preview}>
            <RichTextDisplay data={selected.item?.components[0].template!.description} />
          </Typography>
        </Grid>
        <Grid item xs={12} sm={3}>
          <List component="nav">
            <Paper className={classes.paper}>
              <Typography variant="body2" color="textSecondary" component="p">
                <FormattedMessage id="form.labels.price" />
              </Typography>
              {selected.price?.components.map(component => (
                <ListItem
                  key={component.id}
                  button
                  component={RouterLink}
                  to={`/${component.contract!.contractType.toLowerCase()}/templates/${component.templateId}`}
                >
                  <ListItemText>
                    {component.template!.title} ({component.amount})
                  </ListItemText>
                </ListItem>
              ))}
              <CraftButton craft={selected} />
            </Paper>
          </List>
        </Grid>
      </Grid>
    </Fragment>
  );
};
