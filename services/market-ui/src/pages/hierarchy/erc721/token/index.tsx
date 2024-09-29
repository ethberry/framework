import { FC, Fragment } from "react";
import { Grid } from "@mui/material";

import { Breadcrumbs, PageHeader, Spinner } from "@ethberry/mui-page-layout";
import { RichTextDisplay } from "@ethberry/mui-rte";
import { useCollection } from "@ethberry/provider-collection";
import { emptyStateString } from "@ethberry/draft-js-utils";
import type { ITemplate, IToken } from "@framework/types";

import { TokenHistory } from "../../../../components/common/token-history";
import { DismantleTokenPanel } from "../../../mechanics/gaming/recipes/dismantle/dismantle-token-panel";
import { GenesTokenPanel } from "../../../mechanics/gaming/genes/genes-token-panel";
import { TraitTokenPanel } from "../../../mechanics/gaming/traits/traits-token-panel";
import { DiscreteTokenPanel } from "../../../mechanics/gaming/discrete/discrete-token-panel";
import { RarityTokenPanel } from "../../../mechanics/gaming/rarity/rarity-token-panel";
import { MysteryTokenPanel } from "../../../mechanics/marketing/mystery/token/mystery-token-panel";
import { LendTokenPanel } from "../../../mechanics/gaming/rent/token-item/lend-token-panel";
import { CommonTokenPanel } from "./common-token-panel";
import { IpfsTokenPanel } from "./ipfs-token-panel";
import { OpenSeaTokenPanel } from "./opensea-token-panel";
import { StyledDescription, StyledImage } from "./styled";

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

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <Fragment>
      <Breadcrumbs path={["dashboard", "erc721", "erc721.token"]} data={[{}, {}, selected.template]} />

      <PageHeader message="pages.erc721.token.title" data={selected.template} />

      <Grid container>
        <Grid item xs={12} sm={8.5}>
          <StyledImage component="img" src={selected.template!.imageUrl} alt="Gemunion token image" />
          <StyledDescription>
            <RichTextDisplay data={selected.template!.description} />
          </StyledDescription>
        </Grid>
        <Grid item xs={12} sm={3.5}>
          {selected.templateId ? (
            <>
              <CommonTokenPanel token={selected} />
              <RarityTokenPanel token={selected} />
              <DiscreteTokenPanel token={selected} />
              <MysteryTokenPanel token={selected} onRefreshPage={handleRefreshPage} />
              <GenesTokenPanel token={selected} />
              <TraitTokenPanel token={selected} />
              <DismantleTokenPanel token={selected} />
              <LendTokenPanel token={selected} />
              <IpfsTokenPanel token={selected} />
              <OpenSeaTokenPanel token={selected} />
            </>
          ) : null}
        </Grid>
      </Grid>

      {selected.id ? <TokenHistory token={selected} /> : null}
    </Fragment>
  );
};
