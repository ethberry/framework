import { FC, Fragment } from "react";
import { FormattedMessage } from "react-intl";

import { Grid, Paper, Typography } from "@mui/material";

import { Breadcrumbs, PageHeader, Spinner } from "@gemunion/mui-page-layout";
import { RichTextDisplay } from "@gemunion/mui-rte";
import { useCollection } from "@gemunion/react-hooks";
import { emptyStateString } from "@gemunion/draft-js-utils";

import type { IContractHistory, ITemplate, IToken } from "@framework/types";
import { ContractFeatures } from "@framework/types";

import { TokenSellButton, TokenTransferButton, UpgradeButton } from "../../../../components/buttons";
import { formatPrice } from "../../../../utils/money";
import { TokenAttributesView } from "../../genes";

import { useStyles } from "./styles";
import { TokenHistory } from "../../../../components/common/token-history";

export interface ITokenWithHistory extends IToken {
  contractHistory: Array<IContractHistory>;
}

export const Erc721Token: FC = () => {
  const { selected, isLoading, search, handleChangeRowsPerPage, handleChangePage } = useCollection<ITokenWithHistory>({
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
      <Breadcrumbs
        path={{
          dashboard: "dashboard",
          "erc721.tokens": "erc721-tokens",
          "erc721.token": "erc721.token",
        }}
        data={[{}, {}, selected.template]}
      />

      <PageHeader message="pages.erc721.token.title" data={selected.template} />

      <Grid container>
        <Grid item xs={9}>
          <img src={selected.template!.imageUrl} />
          <Typography variant="body2" color="textSecondary" component="div" className={classes.preview}>
            <RichTextDisplay data={selected.template!.description} />
          </Typography>
        </Grid>
        <Grid item xs={3}>
          <Paper className={classes.paper}>
            <FormattedMessage id="pages.token.priceTitle" />
            <ul className={classes.price}>
              {formatPrice(selected.template?.price)
                .split(", ")
                .map((item: string, index: number) => (
                  <li key={index}>{item}</li>
                ))}
            </ul>
            <TokenSellButton token={selected} />
            <TokenTransferButton token={selected} />
          </Paper>

          {selected.template?.contract?.contractFeatures.includes(ContractFeatures.UPGRADEABLE) ? (
            <Paper className={classes.paper}>
              <Typography>
                <FormattedMessage id="pages.erc721.token.level" values={selected.attributes} />
              </Typography>
              <UpgradeButton token={selected} />
            </Paper>
          ) : null}

          {selected.template?.contract?.contractFeatures.includes(ContractFeatures.GENES) ? (
            <Paper className={classes.paper}>
              <Typography>
                <FormattedMessage id="pages.erc721.token.genes" />
              </Typography>
              <TokenAttributesView attributes={selected.attributes} />
            </Paper>
          ) : null}
        </Grid>
        <TokenHistory
          token={selected}
          isLoading={isLoading}
          search={search}
          handleChangePage={handleChangePage}
          handleChangeRowsPerPage={handleChangeRowsPerPage}
        />
      </Grid>
    </Fragment>
  );
};
