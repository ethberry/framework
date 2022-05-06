import { FC, Fragment } from "react";
import { FormattedMessage } from "react-intl";
import { Grid, Paper, Typography } from "@mui/material";

import { Spinner } from "@gemunion/mui-progress";
import { PageHeader } from "@gemunion/mui-page-header";
import { IErc721Template } from "@framework/types";
import { RichTextDisplay } from "@gemunion/mui-rte";
import { Breadcrumbs } from "@gemunion/mui-breadcrumbs";
import { useCollection } from "@gemunion/react-hooks";
import { emptyStateString } from "@gemunion/draft-js-utils";

import { formatMoney } from "../../../utils/money";
import { useStyles } from "./styles";
import { Erc721ItemTemplateBuyButton } from "../../../components/buttons";

export const Erc721Template: FC = () => {
  const { selected, isLoading } = useCollection<IErc721Template>({
    baseUrl: "/erc721-templates",
    empty: {
      description: emptyStateString,
    },
  });

  const classes = useStyles();

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <Fragment>
      <Breadcrumbs path={["dashboard", "erc721-template"]} data={[{}, selected]} />

      <PageHeader message="pages.erc721-template.title" data={selected} />

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
              <FormattedMessage id="pages.erc721-template.price" values={{ amount: formatMoney(selected.price) }} />
            </Typography>
            <Erc721ItemTemplateBuyButton template={selected} />
          </Paper>
        </Grid>
      </Grid>
    </Fragment>
  );
};
