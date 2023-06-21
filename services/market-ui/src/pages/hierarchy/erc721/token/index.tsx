import { FC, Fragment } from "react";
import { FormattedMessage } from "react-intl";

import { Box, Grid, Typography } from "@mui/material";

import { Breadcrumbs, PageHeader, Spinner } from "@gemunion/mui-page-layout";
import { RichTextDisplay } from "@gemunion/mui-rte";
import { useCollection } from "@gemunion/react-hooks";
import { emptyStateString } from "@gemunion/draft-js-utils";
import type { ITemplate } from "@framework/types";
import { ContractFeatures, GradeAttribute, TokenMetadata, TokenRarity } from "@framework/types";

import { Erc721TransferButton, GradeButton, TokenLendButton, TokenSellButton } from "../../../../components/buttons";
import { ITokenWithHistory, TokenHistory } from "../../../../components/common/token-history";
import { formatPrice } from "../../../../utils/money";
import { TokenTraitsView } from "../../traits";
import { TokenGenesisView } from "../../genesis";
import { StyledPaper } from "./styled";

export const Erc721Token: FC = () => {
  const { selected, isLoading, search, handleChangePaginationModel } = useCollection<ITokenWithHistory>({
    baseUrl: "/erc721/tokens",
    empty: {
      metadata: { GRADE: "0", RARITY: "0", TEMPLATE_ID: "0" },
      template: {
        title: "",
        description: emptyStateString,
      } as ITemplate,
    },
  });

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <Fragment>
      <Breadcrumbs path={["dashboard", "erc721", "erc721.token"]} data={[{}, {}, selected.template]} />

      <PageHeader message="pages.erc721.token.title" data={selected.template} />

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
          <StyledPaper>
            <FormattedMessage id="pages.token.priceTitle" />
            <Box component="ul" sx={{ pl: 0, listStylePosition: "inside" }}>
              {formatPrice(selected.template?.price)
                .split(", ")
                .map((item: string, index: number) => (
                  <li key={index}>{item}</li>
                ))}
            </Box>
            <TokenSellButton token={selected} />
            <Erc721TransferButton token={selected} />
            <TokenLendButton token={selected} />
          </StyledPaper>

          {selected.template?.contract?.contractFeatures.includes(ContractFeatures.RANDOM) ? (
            <StyledPaper>
              <Typography>
                <FormattedMessage
                  id="pages.erc721.token.rarity"
                  values={{ rarity: Object.values(TokenRarity)[selected.metadata[TokenMetadata.RARITY]] }}
                />
              </Typography>
            </StyledPaper>
          ) : null}
          {selected.template?.contract?.contractFeatures.includes(ContractFeatures.UPGRADEABLE) ? (
            <StyledPaper>
              <Typography>
                <FormattedMessage
                  id="pages.erc721.token.level"
                  values={{ level: selected.metadata[TokenMetadata.GRADE] }}
                />
              </Typography>
              <GradeButton token={selected} attribute={GradeAttribute.GRADE} />
            </StyledPaper>
          ) : null}
          {selected.template?.contract?.contractFeatures.includes(ContractFeatures.GENES) ? (
            <StyledPaper>
              <Typography>
                <FormattedMessage id="pages.erc721.token.genesis" />
              </Typography>
              <TokenGenesisView metadata={selected.metadata} />
            </StyledPaper>
          ) : null}
          {selected.template?.contract?.contractFeatures.includes(ContractFeatures.GENES) ? (
            <StyledPaper>
              <Typography>
                <FormattedMessage id="pages.erc721.token.traits" />
              </Typography>
              <TokenTraitsView metadata={selected.metadata} />
            </StyledPaper>
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
