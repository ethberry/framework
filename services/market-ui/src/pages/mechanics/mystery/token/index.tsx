import { FC, Fragment } from "react";
import { Box, Grid, Paper, Typography } from "@mui/material";
import { FormattedMessage } from "react-intl";

import { Breadcrumbs, PageHeader, Spinner } from "@gemunion/mui-page-layout";
import type { ITemplate, IToken } from "@framework/types";
import { RichTextDisplay } from "@gemunion/mui-rte";
import { useCollection } from "@gemunion/react-hooks";
import { emptyStateString } from "@gemunion/draft-js-utils";

import { Erc721TransferButton, MysteryWrapperUnpackButton, TokenSellButton } from "../../../../components/buttons";
import { MysteryBoxContent } from "../../../../components/tables/mysterybox-content";
import { TokenHistory } from "../../../../components/common/token-history";
import { formatPrice } from "../../../../utils/money";

export const MysteryBoxToken: FC = () => {
  const { selected, handleRefreshPage, isLoading } = useCollection<IToken>({
    baseUrl: "/mystery/tokens",
    empty: {
      template: {
        title: "",
        description: emptyStateString,
        box: {},
      } as unknown as ITemplate,
    },
  });

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <Fragment>
      <Breadcrumbs path={["dashboard", "mystery", "mystery.token"]} data={[{}, {}, selected.template]} />

      <PageHeader message="pages.mystery.token.title" data={selected.template} />

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
          <Paper sx={{ p: 2, mb: 2 }}>
            <Typography>
              <FormattedMessage
                id="pages.mystery.token.price"
                values={{ amount: formatPrice(selected.template?.price) }}
              />
            </Typography>
            <TokenSellButton token={selected} />
            <Erc721TransferButton token={selected} />
            <MysteryWrapperUnpackButton token={selected} onRefreshPage={handleRefreshPage} />
          </Paper>
        </Grid>
      </Grid>

      {/* @ts-ignore */}
      <MysteryBoxContent mysteryBox={selected.template?.box} />

      {selected.id ? <TokenHistory token={selected} /> : null}
    </Fragment>
  );
};
