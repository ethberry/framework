import { FC, Fragment } from "react";
import { FormattedMessage } from "react-intl";

import { Box, Grid, Paper, Typography } from "@mui/material";

import { Breadcrumbs, PageHeader, Spinner } from "@gemunion/mui-page-layout";
import { RichTextDisplay } from "@gemunion/mui-rte";
import { useCollection } from "@gemunion/react-hooks";
import { emptyStateString } from "@gemunion/draft-js-utils";

import type { ITemplate } from "@framework/types";
import { ContractFeatures, GradeAttribute } from "@framework/types";

import { GradeButton, TokenLendButton, TokenSellButton, TokenTransferButton } from "../../../../../components/buttons";
import { ITokenWithHistory, TokenHistory } from "../../../../../components/common/token-history";
import { formatPrice } from "../../../../../utils/money";
import { TokenAttributesView } from "../../genes";
import { TokenGenesisView } from "../../genesis";

import { useStyles } from "./styles";
import { RarityBadge } from "../../../../../components/common/badge";

export const Erc721Token: FC = () => {
  const { selected, isLoading, search, handleChangePaginationModel } = useCollection<ITokenWithHistory>({
    baseUrl: "/erc721/tokens",
    empty: {
      attributes: { GRADE: "0", RARITY: "0", TEMPLATE_ID: "0" },
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
      <Breadcrumbs path={["dashboard", "erc721", "erc721.token"]} data={[{}, {}, selected.template]} />

      <PageHeader message="pages.erc721.token.title" data={selected.template} />

      <Grid container>
        <Grid item xs={12} sm={9}>
          <RarityBadge token={selected} itemClass={true} />
          <Box
            component="img"
            src={selected.template!.imageUrl}
            alt="Gemunion token image"
            sx={{ display: "block", mx: "auto", maxWidth: "70%" }}
          />
          <Typography variant="body2" color="textSecondary" component="div" sx={{ my: 1 }}>
            <RichTextDisplay data={selected.template!.description} />
          </Typography>
        </Grid>
        <Grid item xs={12} sm={3}>
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
            <TokenLendButton token={selected} />
          </Paper>

          {selected.template?.contract?.contractFeatures.includes(ContractFeatures.UPGRADEABLE) ? (
            <Paper className={classes.paper}>
              <Typography>
                <FormattedMessage
                  id="pages.erc721.token.level"
                  values={selected.attributes.GRADE ? selected.attributes : { GRADE: 0 }}
                />
              </Typography>
              <GradeButton token={selected} attribute={GradeAttribute.GRADE} />
            </Paper>
          ) : null}
          {selected.template?.contract?.contractFeatures.includes(ContractFeatures.GENES) ? (
            <Paper className={classes.paper}>
              <Typography>
                <FormattedMessage id="pages.erc721.token.genesis" />
              </Typography>
              <TokenGenesisView attributes={selected.attributes} />
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
          handleChangePaginationModel={handleChangePaginationModel}
        />
      </Grid>
    </Fragment>
  );
};
