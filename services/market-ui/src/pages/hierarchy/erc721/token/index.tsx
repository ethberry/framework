import { FC, Fragment, useEffect, useState } from "react";
import { FormattedMessage } from "react-intl";

import { Box, Grid, Typography } from "@mui/material";

import { Breadcrumbs, PageHeader, Spinner } from "@gemunion/mui-page-layout";
import { RichTextDisplay } from "@gemunion/mui-rte";
import { useCollection } from "@gemunion/react-hooks";
import { emptyStateString } from "@gemunion/draft-js-utils";
import type { ITemplate, IUser } from "@framework/types";
import { ContractFeatures, IToken, TokenMetadata, TokenRarity } from "@framework/types";
import { useUser } from "@gemunion/provider-user";

import {
  Erc721TransferButton,
  GradeButton,
  MysteryWrapperUnpackButton,
  TokenLendButton,
  TokenSellButton,
} from "../../../../components/buttons";
import { TokenHistory } from "../../../../components/common/token-history";
import { MysteryBoxContent } from "../../../../components/tables/mysterybox-content";
import { useCheckAccessMetadata } from "../../../../utils/use-check-access-metadata";
import { formatPrice } from "../../../../utils/money";
import { TokenTraitsView } from "../../traits";
import { TokenGenesisView } from "../../genesis";
import { TokenGradeView } from "../../grade";
import { StyledPaper } from "./styled";
import { DismantlePanel } from "../../../mechanics/craft/dismantle-panel";

export const Erc721Token: FC = () => {
  const { selected, isLoading, handleRefreshPage } = useCollection<IToken>({
    baseUrl: "/erc721/tokens",
    empty: {
      metadata: { LEVEL: "0", RARITY: "0", TEMPLATE_ID: "0" },
      templateId: 0,
      template: {
        title: "",
        description: emptyStateString,
        box: {},
      } as unknown as ITemplate,
    },
  });

  const user = useUser<IUser>();
  const { checkAccessMetadata } = useCheckAccessMetadata();
  const [hasAccess, setHasAccess] = useState(false);

  useEffect(() => {
    if (selected.template?.contract?.address && user?.profile?.wallet) {
      void checkAccessMetadata(void 0, {
        account: user.profile.wallet,
        address: selected.template.contract.address,
      })
        .then((json: { hasRole: boolean }) => {
          setHasAccess(json?.hasRole);
        })
        .catch(console.error);
    }
  }, [user?.profile?.wallet, selected]);

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
            <MysteryWrapperUnpackButton token={selected} refreshPage={handleRefreshPage} />
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
          {selected.template?.contract?.contractFeatures.includes(ContractFeatures.DISCRETE) ? (
            <StyledPaper>
              <Typography>
                <FormattedMessage id="pages.erc721.token.grade" />
              </Typography>
              <TokenGradeView metadata={selected.metadata} />
              <GradeButton token={selected} disabled={!hasAccess} />
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
          {selected.template?.contract?.contractFeatures.includes(ContractFeatures.TRAITS) ? (
            <StyledPaper>
              <Typography>
                <FormattedMessage id="pages.erc721.token.traits" />
              </Typography>
              <TokenTraitsView metadata={selected.metadata} />
            </StyledPaper>
          ) : null}

          {selected.templateId ? <DismantlePanel token={selected} /> : null}
        </Grid>
      </Grid>

      {/* @ts-ignore */}
      <MysteryBoxContent mysteryBox={selected.template?.box} />

      {selected.id ? <TokenHistory token={selected} /> : null}
    </Fragment>
  );
};
