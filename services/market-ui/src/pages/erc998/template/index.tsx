import { FC, Fragment } from "react";
import { FormattedMessage } from "react-intl";
import { Grid, Paper, Typography } from "@mui/material";

import { Breadcrumbs, PageHeader, Spinner } from "@gemunion/mui-page-layout";
import { IErc998Template } from "@framework/types";
import { RichTextDisplay } from "@gemunion/mui-rte";
import { useCollection } from "@gemunion/react-hooks";
import { emptyStateString } from "@gemunion/draft-js-utils";

import { formatEther } from "../../../utils/money";
import { useStyles } from "./styles";
import { Erc998ItemTemplateBuyButton } from "../../../components/buttons";

export const Erc998Template: FC = () => {
  const { selected, isLoading } = useCollection<IErc998Template>({
    baseUrl: "/erc998-templates",
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
      <Breadcrumbs path={["dashboard", "erc998-template"]} data={[{}, selected]} />

      <PageHeader message="pages.erc998-template.title" data={selected} />

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
              <FormattedMessage id="pages.erc998-template.price" values={{ amount: formatEther(selected.price) }} />
            </Typography>
            <Erc998ItemTemplateBuyButton template={selected} />
          </Paper>
        </Grid>
      </Grid>
    </Fragment>
  );
};
