import { FC, Fragment } from "react";
import { Grid, Paper, Typography } from "@mui/material";

import { Breadcrumbs, PageHeader, Spinner } from "@gemunion/mui-page-layout";
import { IErc998Template, IErc998Token } from "@framework/types";
import { RichTextDisplay } from "@gemunion/mui-rte";
import { useCollection } from "@gemunion/react-hooks";
import { emptyStateString } from "@gemunion/draft-js-utils";

import { useStyles } from "./styles";
import { Erc998TokenAuctionButton } from "../../../components/buttons";

export const Erc998Token: FC = () => {
  const { selected, isLoading } = useCollection<IErc998Token>({
    baseUrl: "/erc998-tokens",
    empty: {
      erc998Template: {
        description: emptyStateString,
      } as IErc998Template,
    },
  });

  const classes = useStyles();

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <Fragment>
      <Breadcrumbs path={["dashboard", "erc998-token"]} data={[{}, selected.erc998Template]} />

      <PageHeader message="pages.erc998-token.title" data={selected.erc998Template} />

      <Grid container>
        <Grid item xs={9}>
          <img src={selected.erc998Template!.imageUrl} />
          <Typography variant="body2" color="textSecondary" component="div" className={classes.preview}>
            <RichTextDisplay data={selected.erc998Template!.description} />
          </Typography>
        </Grid>
        <Grid item xs={3}>
          <Paper className={classes.paper}>
            <Erc998TokenAuctionButton token={selected} />
          </Paper>
        </Grid>
      </Grid>
    </Fragment>
  );
};
