import { FC, Fragment } from "react";
import { Box, Grid, Paper, Typography } from "@mui/material";
import { FormattedMessage } from "react-intl";

import { Breadcrumbs, PageHeader, Spinner } from "@gemunion/mui-page-layout";
import type { ITemplate, IToken } from "@framework/types";
import { RichTextDisplay } from "@gemunion/mui-rte";
import { useCollection } from "@gemunion/react-hooks";
import { emptyStateString } from "@gemunion/draft-js-utils";

import { Erc721TransferButton, TokenSellButton } from "../../../../components/buttons";
import { MysteryboxContent } from "../../../../components/tables/mysterybox-content";
import { formatPrice } from "../../../../utils/money";
import { TokenHistory } from "../../../../components/common/token-history";
import { MysteryWrapperUnpackButton } from "../../../../components/buttons/mechanics/mysterybox/unpack";

export const MysteryboxToken: FC = () => {
  const { selected, search, handleChangePaginationModel, isLoading } = useCollection<IToken>({
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
        <Grid item xs={9}>
          <Box component="img" sx={{ maxWidth: "100%" }} src={selected.template!.imageUrl} />
          <Typography variant="body2" color="textSecondary" component="div">
            <RichTextDisplay data={selected.template!.description} />
          </Typography>
        </Grid>
        <Grid item xs={3}>
          <Paper sx={{ p: 2, mb: 2 }}>
            <Typography>
              <FormattedMessage
                id="pages.mystery.token.price"
                values={{ amount: formatPrice(selected.template?.price) }}
              />
            </Typography>
            <TokenSellButton token={selected} />
            <Erc721TransferButton token={selected} />
            <MysteryWrapperUnpackButton token={selected} />
          </Paper>
        </Grid>
      </Grid>

      {/* @ts-ignore */}
      <MysteryboxContent mysterybox={selected.template.box} />

      <TokenHistory
        token={selected}
        isLoading={isLoading}
        search={search}
        handleChangePaginationModel={handleChangePaginationModel}
      />
    </Fragment>
  );
};
