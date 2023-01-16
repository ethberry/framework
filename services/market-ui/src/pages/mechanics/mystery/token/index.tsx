import { FC, Fragment } from "react";
import { Grid, Paper, Typography } from "@mui/material";
import { FormattedMessage } from "react-intl";

import { Breadcrumbs, PageHeader, Spinner } from "@gemunion/mui-page-layout";
import type { ITemplate, IToken } from "@framework/types";
import { RichTextDisplay } from "@gemunion/mui-rte";
import { useCollection } from "@gemunion/react-hooks";
import { emptyStateString } from "@gemunion/draft-js-utils";

import { useStyles } from "./styles";
import { TokenSellButton } from "../../../../components/buttons";
import { formatPrice } from "../../../../utils/money";

export const MysteryboxToken: FC = () => {
  const { selected, isLoading } = useCollection<IToken>({
    baseUrl: "/mystery-tokens",
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
          "mystery.tokens": "mystery-tokens",
          "mystery.token": "mystery.token",
        }}
        data={[{}, {}, selected.template]}
      />

      <PageHeader message="pages.mystery.token.title" data={selected.template} />

      <Grid container>
        <Grid item xs={9}>
          <img src={selected.template!.imageUrl} />
          <Typography variant="body2" color="textSecondary" component="div" className={classes.preview}>
            <RichTextDisplay data={selected.template!.description} />
          </Typography>
        </Grid>
        <Grid item xs={3}>
          <Paper className={classes.paper}>
            <Typography>
              <FormattedMessage
                id="pages.mystery.token.price"
                values={{ amount: formatPrice(selected.template?.price) }}
              />
            </Typography>
            <TokenSellButton token={selected} />
          </Paper>
        </Grid>
      </Grid>
    </Fragment>
  );
};
