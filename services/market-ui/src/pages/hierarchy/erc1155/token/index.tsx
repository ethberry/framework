import { FC, Fragment } from "react";
import { Box, Grid, Paper, Typography } from "@mui/material";
import { FormattedMessage } from "react-intl";

import { Breadcrumbs, PageHeader, Spinner } from "@gemunion/mui-page-layout";
import type { IBalance, ITemplate, IToken } from "@framework/types";
import { RichTextDisplay } from "@gemunion/mui-rte";
import { useCollection } from "@gemunion/react-hooks";
import { emptyStateString } from "@gemunion/draft-js-utils";

import { useStyles } from "./styles";
import { Erc1155TransferButton, TokenSellButton } from "../../../../components/buttons";
import { formatPrice } from "../../../../utils/money";
import { TokenHistory } from "../../../../components/common/token-history";

export const Erc1155Token: FC = () => {
  const { selected, isLoading, search, handleChangePaginationModel } = useCollection<IToken>({
    baseUrl: "/erc1155/tokens",
    empty: {
      balance: [
        {
          amount: "0",
        } as IBalance,
      ],
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
      <Breadcrumbs path={["dashboard", "erc1155", "erc1155.token"]} data={[{}, {}, selected.template]} />

      <PageHeader message="pages.erc1155.token.title" data={selected.template} />

      <Grid container>
        <Grid item xs={12} sm={9}>
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
            <FormattedMessage id="pages.token.balanceTitle" />
            <p className={classes.price}>{selected.balance?.at(0)?.amount}</p>
            <TokenSellButton token={selected} />
            <Erc1155TransferButton token={selected} />
          </Paper>
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
