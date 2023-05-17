import { FC, Fragment } from "react";
import { Box, Grid, Paper, Typography } from "@mui/material";
import { FormattedMessage } from "react-intl";

import { Breadcrumbs, PageHeader, Spinner } from "@gemunion/mui-page-layout";
import type { ITemplate, IToken } from "@framework/types";
import { ModuleType } from "@framework/types";
import { RichTextDisplay } from "@gemunion/mui-rte";
import { useCollection } from "@gemunion/react-hooks";
import { emptyStateString } from "@gemunion/draft-js-utils";

import { useStyles } from "./styles";
import { TokenSellButton } from "../../../../components/buttons";
import { formatPrice } from "../../../../utils/money";
import { WrapperContent } from "../../../../components/tables/wrapper-content";

export const WrapperToken: FC = () => {
  const { selected, isLoading } = useCollection<IToken>({
    baseUrl: "/wrapper-tokens",
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
          "wrapper.tokens": "wrapper-tokens",
          "wrapper.token": "wrapper.token",
        }}
        data={[{}, {}, selected.template]}
      />

      <PageHeader message="pages.wrapper.token.title" data={selected.template} />

      <Grid container>
        <Grid item xs={9}>
          <Box component="img" sx={{ maxWidth: "100%" }} src={selected.template!.imageUrl} />
          <Typography variant="body2" color="textSecondary" component="div" className={classes.preview}>
            <RichTextDisplay data={selected.template!.description} />
          </Typography>
        </Grid>
        <Grid item xs={3}>
          {selected.template?.contract?.contractModule === ModuleType.HIERARCHY ||
          selected.template?.contract?.contractModule === ModuleType.MYSTERY ? (
            <Paper className={classes.paper}>
              <Typography>
                <FormattedMessage
                  id="pages.wrapper.token.price"
                  values={{ amount: formatPrice(selected.template?.price) }}
                />
              </Typography>
              <TokenSellButton token={selected} />
            </Paper>
          ) : null}
        </Grid>
      </Grid>
      <WrapperContent wrapper={selected} />
    </Fragment>
  );
};
