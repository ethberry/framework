import { FC, Fragment } from "react";
import { Alert, Box, Grid, List, ListItem, ListItemText, Typography } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import { FormattedMessage } from "react-intl";

import { Breadcrumbs, PageHeader, Spinner } from "@gemunion/mui-page-layout";
import { RichTextDisplay } from "@gemunion/mui-rte";
import { useCollection } from "@gemunion/react-hooks";
import { emptyItem, emptyPrice } from "@gemunion/mui-inputs-asset";

import { ICraft } from "@framework/types";

import { CraftButton } from "../../../../../components/buttons";
import { formatEther } from "../../../../../utils/money";
import { StyledPaper } from "./styled";
import { CraftTransactions } from "./transactions";

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
                // TODO FIXME - make a better grid of multiple items?
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
          <List component="nav">
            <StyledPaper>
              <Typography variant="body2" color="textSecondary" component="p">
                <FormattedMessage id="form.labels.price" />
              </Typography>
              {selected.price?.components.map((component, i) => (
                <ListItem
                  key={component.id || i}
                  button
                  component={RouterLink}
                  to={`/${component.tokenType.toLowerCase()}/templates/${component.templateId!}`}
                >
                  <ListItemText>
                    {component.template!.title}{" "}
                    {`(${formatEther(component.amount, component.contract!.decimals, component.contract!.symbol)}`})
                  </ListItemText>
                </ListItem>
              ))}
              <Alert severity="warning">
                <FormattedMessage id="alert.approveCraft" />
              </Alert>
              <CraftButton craft={selected} />
            </StyledPaper>
          </List>
        </Grid>
      </Grid>

      <br />

      {selected.id ? <CraftTransactions craft={selected} /> : null}
    </Fragment>
  );
};
