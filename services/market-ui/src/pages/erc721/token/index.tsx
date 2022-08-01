import { FC, Fragment } from "react";
import { Grid, Paper, Typography } from "@mui/material";

import { Breadcrumbs, PageHeader, Spinner } from "@gemunion/mui-page-layout";
import { ContractTemplate, ITemplate, IToken } from "@framework/types";
import { RichTextDisplay } from "@gemunion/mui-rte";
import { useCollection } from "@gemunion/react-hooks";
import { emptyStateString } from "@gemunion/draft-js-utils";

import { useStyles } from "./styles";
import { TokenSellButton, UpgradeButton } from "../../../components/buttons";

export const Erc721Token: FC = () => {
  const { selected, isLoading } = useCollection<IToken>({
    baseUrl: "/erc721-tokens",
    empty: {
      template: {
        title: "",
        description: emptyStateString,
      } as ITemplate,
    },
  });

  const classes = useStyles();

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <Fragment>
      <Breadcrumbs path={["dashboard", "erc721-token"]} data={[{}, selected.template]} />

      <PageHeader message="pages.erc721-token.title" data={selected.template} />

      <Grid container>
        <Grid item xs={9}>
          <img src={selected.template!.imageUrl} />
          <Typography variant="body2" color="textSecondary" component="div" className={classes.preview}>
            <RichTextDisplay data={selected.template!.description} />
          </Typography>
        </Grid>
        <Grid item xs={3}>
          <Paper className={classes.paper}>
            <TokenSellButton token={selected} />
          </Paper>

          {selected.template?.contract?.contractTemplate === ContractTemplate.UPGRADEABLE ||
          selected.template?.contract?.contractTemplate === ContractTemplate.RANDOM ? (
            <Paper className={classes.paper}>
              <UpgradeButton token={selected} />
            </Paper>
          ) : null}
        </Grid>
      </Grid>
    </Fragment>
  );
};
