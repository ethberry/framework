import { FC, Fragment } from "react";
import { Grid, Paper, Typography } from "@mui/material";

import { Breadcrumbs, PageHeader, Spinner } from "@gemunion/mui-page-layout";
import { IUniTemplate, IUniToken } from "@framework/types";
import { RichTextDisplay } from "@gemunion/mui-rte";
import { useCollection } from "@gemunion/react-hooks";
import { emptyStateString } from "@gemunion/draft-js-utils";

import { useStyles } from "./styles";
import { Erc721TokenSellButton } from "../../../components/buttons";

export const Erc721Token: FC = () => {
  const { selected, isLoading } = useCollection<IUniToken>({
    baseUrl: "/erc721-tokens",
    empty: {
      uniTemplate: {
        description: emptyStateString,
      } as IUniTemplate,
    },
  });

  const classes = useStyles();

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <Fragment>
      <Breadcrumbs path={["dashboard", "erc721-token"]} data={[{}, selected.uniTemplate]} />

      <PageHeader message="pages.erc721-token.title" data={selected.uniTemplate} />

      <Grid container>
        <Grid item xs={9}>
          <img src={selected.uniTemplate!.imageUrl} />
          <Typography variant="body2" color="textSecondary" component="div" className={classes.preview}>
            <RichTextDisplay data={selected.uniTemplate!.description} />
          </Typography>
        </Grid>
        <Grid item xs={3}>
          <Paper className={classes.paper}>
            <Erc721TokenSellButton token={selected} />
          </Paper>
        </Grid>
      </Grid>
    </Fragment>
  );
};
