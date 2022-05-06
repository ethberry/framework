import { FC, Fragment } from "react";
import { Grid, Paper, Typography } from "@mui/material";

import { Spinner } from "@gemunion/mui-progress";
import { PageHeader } from "@gemunion/mui-page-header";
import { IErc721Template, IErc721Token } from "@framework/types";
import { RichTextDisplay } from "@gemunion/mui-rte";
import { Breadcrumbs } from "@gemunion/mui-breadcrumbs";
import { useCollection } from "@gemunion/react-hooks";
import { emptyStateString } from "@gemunion/draft-js-utils";

import { useStyles } from "./styles";
import { Erc721TokenSellButton } from "../../../components/buttons/erc721/token-sell";

export const Erc721Token: FC = () => {
  const { selected, isLoading } = useCollection<IErc721Token>({
    baseUrl: "/erc721-tokens",
    empty: {
      erc721Template: {
        description: emptyStateString,
      } as IErc721Template,
    },
  });

  const classes = useStyles();

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <Fragment>
      <Breadcrumbs path={["dashboard", "erc721-token"]} data={[{}, selected.erc721Template]} />

      <PageHeader message="pages.erc721-token.title" data={selected.erc721Template} />

      <Grid container>
        <Grid item xs={9}>
          <img src={selected.erc721Template!.imageUrl} />
          <Typography variant="body2" color="textSecondary" component="div" className={classes.preview}>
            <RichTextDisplay data={selected.erc721Template!.description} />
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
