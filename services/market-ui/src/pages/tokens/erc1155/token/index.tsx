import { FC, Fragment } from "react";
import { Grid, Paper, Typography } from "@mui/material";
import { FormattedMessage } from "react-intl";

import { Breadcrumbs, PageHeader, Spinner } from "@gemunion/mui-page-layout";
import { ITemplate, IToken } from "@framework/types";
import { RichTextDisplay } from "@gemunion/mui-rte";
import { useCollection } from "@gemunion/react-hooks";
import { emptyStateString } from "@gemunion/draft-js-utils";

import { useStyles } from "./styles";
import { TokenSellButton } from "../../../../components/buttons";
import { formatPrice } from "../../../../utils/money";

export const Erc1155Token: FC = () => {
  const { selected, isLoading } = useCollection<IToken>({
    baseUrl: "/erc1155-tokens",
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
          "erc1155.tokens": "erc1155-tokens",
          "erc1155.token": "erc1155.token",
        }}
        data={[{}, {}, selected.template]}
      />

      <PageHeader message="pages.erc1155.token.title" data={selected.template} />

      <Grid container>
        <Grid item xs={9}>
          <img src={selected.template!.imageUrl} />
          <Typography variant="body2" color="textSecondary" component="div" className={classes.preview}>
            <RichTextDisplay data={selected.template!.description} />
          </Typography>
        </Grid>
        <Grid item xs={3}>
          <Paper className={classes.paper}>
            <FormattedMessage
              id="pages.erc1155.token.price"
              values={{ amount: formatPrice(selected.template?.price) }}
            />
            <TokenSellButton token={selected} />
          </Paper>
        </Grid>
      </Grid>
    </Fragment>
  );
};
