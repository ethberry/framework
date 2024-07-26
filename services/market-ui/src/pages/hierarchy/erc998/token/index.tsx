import { FC, Fragment } from "react";
import { Grid } from "@mui/material";

import { Breadcrumbs, PageHeader, Spinner } from "@gemunion/mui-page-layout";
import { RichTextDisplay } from "@gemunion/mui-rte";
import { useCollection } from "@gemunion/provider-collection";
import { emptyStateString } from "@gemunion/draft-js-utils";
import type { ITemplate, IToken } from "@framework/types";

import { TokenHistory } from "../../../../components/common/token-history";
import { DismantleTokenPanel } from "../../../mechanics/gaming/recipes/dismantle/dismantle-token-panel";
import { RarityTokenPanel } from "../../../mechanics/gaming/rarity/rarity-token-panel";
import { DiscreteTokenPanel } from "../../../mechanics/gaming/discrete/discrete-token-panel";
import { GenesTokenPanel } from "../../../mechanics/gaming/genes/genes-token-panel";
import { TraitTokenPanel } from "../../../mechanics/gaming/traits/traits-token-panel";
import { MysteryTokenPanel } from "../../../mechanics/marketing/mystery/token/mystery-token-panel";
import { LendTokenPanel } from "../../../mechanics/gaming/rent/token-item/lend-token-panel";
import { CommonTokenPanel } from "../../erc721/token/common-token-panel";
import { IpfsTokenPanel } from "../../erc721/token/ipfs-token-panel";
import { OpenSeaTokenPanel } from "../../erc721/token/opensea-token-panel";
import { Erc998Composition } from "./composition";
import { StyledDescription, StyledImage } from "./styled";

export const Erc998Token: FC = () => {
  const { selected, isLoading, handleRefreshPage } = useCollection<IToken>({
    baseUrl: "/erc998/tokens",
    empty: {
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
      <Breadcrumbs path={["dashboard", "erc998", "erc998.token"]} data={[{}, {}, selected.template]} />

      <PageHeader message="pages.erc998.token.title" data={selected.template} />

      <Grid container>
        <Grid item xs={12} sm={9}>
          <StyledImage component="img" src={selected.template!.imageUrl} alt="Gemunion token image" />
          <StyledDescription>
            <RichTextDisplay data={selected.template!.description} />
          </StyledDescription>
          <br />
          <br />
          <Erc998Composition token={selected} />
        </Grid>
        <Grid item xs={12} sm={3}>
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
