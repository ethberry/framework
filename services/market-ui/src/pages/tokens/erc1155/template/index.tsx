import { FC, Fragment } from "react";
import { FormattedMessage } from "react-intl";
import { Grid, Paper, Typography } from "@mui/material";

import { Breadcrumbs, PageHeader, Spinner } from "@gemunion/mui-page-layout";
import { ITemplate } from "@framework/types";
import { RichTextDisplay } from "@gemunion/mui-rte";
import { emptyStateString } from "@gemunion/draft-js-utils";
import { useCollection } from "@gemunion/react-hooks";

import { formatPrice } from "../../../../utils/money";
import { useStyles } from "./styles";
import { TemplatePurchaseButton } from "../../../../components/buttons";

export const Erc1155Template: FC = () => {
  const { selected, isLoading } = useCollection<ITemplate>({
    baseUrl: "/erc1155-templates",
    empty: {
      title: "",
      description: emptyStateString,
    },
  });

  const classes = useStyles();

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <Fragment>
      <Breadcrumbs path={["dashboard", "erc1155.templates", "erc1155.template"]} data={[{}, {}, selected]} />

      <PageHeader message="pages.erc1155.template.title" data={selected} />

      <Grid container>
        <Grid item xs={9}>
          <img src={selected.imageUrl} />
          <Typography variant="body2" color="textSecondary" component="div" className={classes.preview}>
            <RichTextDisplay data={selected.description} />
          </Typography>
        </Grid>
        <Grid item xs={3}>
          <Paper className={classes.paper}>
            <Typography variant="body2" color="textSecondary" component="p">
              <FormattedMessage id="pages.erc1155.template.price" values={{ amount: formatPrice(selected.price) }} />
            </Typography>
            <TemplatePurchaseButton template={selected} />
          </Paper>
        </Grid>
      </Grid>
    </Fragment>
  );
};
