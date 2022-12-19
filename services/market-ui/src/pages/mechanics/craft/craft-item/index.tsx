import { FC, Fragment } from "react";
import { Grid, List, ListItem, ListItemText, ListSubheader, Typography } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import { FormattedMessage } from "react-intl";

import { Breadcrumbs, PageHeader, Spinner } from "@gemunion/mui-page-layout";
import { RichTextDisplay } from "@gemunion/mui-rte";
import { useCollection } from "@gemunion/react-hooks";
import { emptyItem, emptyPrice } from "@gemunion/mui-inputs-asset";
import { ICraft } from "@framework/types";

import { useStyles } from "./styles";
import { CraftButton } from "../../../../components/buttons";

export const CraftItem: FC = () => {
  const { selected, isLoading } = useCollection<ICraft>({
    baseUrl: "/craft",
    empty: {
      item: emptyItem as any,
      price: emptyPrice as any,
    },
  });

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
          <img src={selected.item?.components[0].template!.imageUrl} alt="Gemunion template image" />
          <Typography variant="body2" color="textSecondary" component="div" className={classes.preview}>
            <RichTextDisplay data={selected.item?.components[0].template!.description} />
          </Typography>
        </Grid>
        <Grid item xs={12} sm={3}>
          <List
            component="nav"
            subheader={
              <ListSubheader>
                <FormattedMessage id="pages.craft.price" />
              </ListSubheader>
            }
          >
            {selected.price?.components.map(component => (
              <ListItem
                key={component.id}
                button
                component={RouterLink}
                to={`/${component.contract!.contractType.toLowerCase()}-templates/${component.templateId}`}
              >
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
