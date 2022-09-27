import { FC, Fragment } from "react";
import { Grid, Paper, Typography } from "@mui/material";

import { FormattedMessage } from "react-intl";

import { Breadcrumbs, PageHeader, Spinner } from "@gemunion/mui-page-layout";
import { ContractFeatures, ITemplate, IToken } from "@framework/types";
import { RichTextDisplay } from "@gemunion/mui-rte";
import { useCollection } from "@gemunion/react-hooks";
import { emptyStateString } from "@gemunion/draft-js-utils";

import { useStyles } from "./styles";
import { TokenSellButton, UpgradeButton } from "../../../../components/buttons";
import { formatPrice } from "../../../../utils/money";
import { Erc998Composition } from "./composition";
import { TokenAttributesView } from "../../genes";

export const Erc998Token: FC = () => {
  const { selected, isLoading } = useCollection<IToken>({
    baseUrl: "/erc998-tokens",
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
      <Breadcrumbs
        path={{
          dashboard: "dashboard",
          "erc998.tokens": "erc998-tokens",
          "erc998.token": "erc998.token",
        }}
        data={[{}, {}, selected.template]}
      />

      <PageHeader message="pages.erc998.token.title" data={selected.template} />

      <Grid container>
        <Grid item xs={9}>
          <img src={selected.template!.imageUrl} />
          <Typography variant="body2" color="textSecondary" component="div" className={classes.preview}>
            <RichTextDisplay data={selected.template!.description} />
          </Typography>
          <br />
          <br />
          <Erc998Composition token={selected} />
        </Grid>
        <Grid item xs={3}>
          <Paper className={classes.paper}>
            <Typography>
              <FormattedMessage
                id="pages.erc998.token.price"
                values={{ amount: formatPrice(selected.template?.price) }}
              />
            </Typography>
            <TokenSellButton token={selected} />
          </Paper>

          {selected.template?.contract?.contractFeatures.includes(ContractFeatures.UPGRADEABLE) ? (
            <Paper className={classes.paper}>
              <Typography>
                <FormattedMessage id="pages.erc998.token.level" values={selected.attributes} />
              </Typography>
              <UpgradeButton token={selected} />
            </Paper>
          ) : null}

          {selected.template?.contract?.contractFeatures.includes(ContractFeatures.GENES) ? (
            <Paper className={classes.paper}>
              <Typography>
                <FormattedMessage id="pages.erc998.token.genes" />
              </Typography>
              <TokenAttributesView attributes={selected.attributes} />
            </Paper>
          ) : null}
        </Grid>
      </Grid>
    </Fragment>
  );
};
