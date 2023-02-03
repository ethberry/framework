import { FC, Fragment } from "react";
import { Grid, Paper, Typography } from "@mui/material";

import { FormattedMessage } from "react-intl";

import { Breadcrumbs, PageHeader, Spinner } from "@gemunion/mui-page-layout";
import { ContractFeatures, GradeAttribute, ITemplate, IToken } from "@framework/types";
import { RichTextDisplay } from "@gemunion/mui-rte";
import { useCollection } from "@gemunion/react-hooks";
import { emptyStateString } from "@gemunion/draft-js-utils";

import { useStyles } from "./styles";
import { TokenSellButton, TokenTransferButton, GradeButton } from "../../../../../components/buttons";
import { formatPrice } from "../../../../../utils/money";
import { Erc998Composition } from "./composition";
import { TokenAttributesView } from "../../genes";
import { TokenHistory } from "../../../../../components/common/token-history";

export const Erc998Token: FC = () => {
  const { selected, isLoading, search, handleChangePage, handleChangeRowsPerPage } = useCollection<IToken>({
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
        <Grid item xs={12} sm={9}>
          <img src={selected.template!.imageUrl} alt="Gemunion token image" />
          <Typography variant="body2" color="textSecondary" component="div" className={classes.preview}>
            <RichTextDisplay data={selected.template!.description} />
          </Typography>
          <br />
          <br />
          <Erc998Composition token={selected} />
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
          </Paper>

          {selected.template?.contract?.contractFeatures.includes(ContractFeatures.UPGRADEABLE) ? (
            <Paper className={classes.paper}>
              <Typography>
                <FormattedMessage id="pages.erc998.token.level" values={selected.attributes} />
              </Typography>
              <GradeButton token={selected} attribute={GradeAttribute.GRADE} />
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
