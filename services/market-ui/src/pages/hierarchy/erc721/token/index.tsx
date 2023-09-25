import { FC, Fragment } from "react";
import { Grid } from "@mui/material";

import { Breadcrumbs, PageHeader, Spinner } from "@gemunion/mui-page-layout";
import { RichTextDisplay } from "@gemunion/mui-rte";
import { useCollection } from "@gemunion/react-hooks";
import { emptyStateString } from "@gemunion/draft-js-utils";
import type { ITemplate, IToken } from "@framework/types";

import { TokenHistory } from "../../../../components/common/token-history";
import { DismantleTokenPanel } from "../../../mechanics/recipes/dismantle/dismantle-token-panel";
import { GenesTokenPanel } from "../../../mechanics/genes/genes-token-panel";
import { TraitTokenPanel } from "../../../mechanics/traits/traits-token-panel";
import { DiscreteTokenPanel } from "../../../mechanics/discrete/discrete-token-panel";
import { RarityTokenPanel } from "../../../mechanics/rarity/rarity-token-panel";
import { MysteryTokenPanel } from "../../../mechanics/mystery/token/mystery-token-panel";
import { LendTokenPanel } from "../../../mechanics/rent/token-item/lend-token-panel";
import { CommonTokenPanel } from "./common-token-panel";
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
        <Grid item xs={12} sm={9}>
          <StyledImage component="img" src={selected.template!.imageUrl} alt="Gemunion token image" />
          <StyledDescription>
            <RichTextDisplay data={selected.template!.description} />
          </StyledDescription>
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
            </>
          ) : null}
        </Grid>
      </Grid>

      {selected.id ? <TokenHistory token={selected} /> : null}
    </Fragment>
  );
};
