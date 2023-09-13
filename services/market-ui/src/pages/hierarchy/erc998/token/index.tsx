import { FC, Fragment } from "react";
import { Box, Grid, Typography } from "@mui/material";

import { Breadcrumbs, PageHeader, Spinner } from "@gemunion/mui-page-layout";
import { RichTextDisplay } from "@gemunion/mui-rte";
import { useCollection } from "@gemunion/react-hooks";
import { emptyStateString } from "@gemunion/draft-js-utils";
import type { ITemplate, IToken } from "@framework/types";

import { TokenHistory } from "../../../../components/common/token-history";
import { DismantleTokenPanel } from "../../../mechanics/recipes/dismantle/dismantle-token-panel";
import { Erc998Composition } from "./composition";
import { CommonTokenPanel } from "../../../mechanics/common/common-token-panel";
import { RarityTokenPanel } from "../../../mechanics/rarity/rarity-token-panel";
import { DiscreteTokenPanel } from "../../../mechanics/discrete/discrete-token-panel";
import { GenesTokenPanel } from "../../../mechanics/genes/genes-token-panel";
import { TraitTokenPanel } from "../../../mechanics/traits/traits-token-panel";

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
          <Box
            component="img"
            src={selected.template!.imageUrl}
            alt="Gemunion token image"
            sx={{ display: "block", mx: "auto", maxWidth: "70%" }}
          />
          <Typography variant="body2" color="textSecondary" component="div" sx={{ my: 1 }}>
            <RichTextDisplay data={selected.template!.description} />
          </Typography>
          <br />
          <br />
          <Erc998Composition token={selected} />
        </Grid>
        <Grid item xs={12} sm={3}>
          <Grid item xs={12} sm={3}>
            {selected.templateId ? (
              <>
                <CommonTokenPanel token={selected} onRefreshPage={handleRefreshPage} />
                <RarityTokenPanel token={selected} />
                <DiscreteTokenPanel token={selected} />
                <GenesTokenPanel token={selected} />
                <TraitTokenPanel token={selected} />
                <DismantleTokenPanel token={selected} />
              </>
            ) : null}
          </Grid>
        </Grid>
      </Grid>

      {selected.id ? <TokenHistory token={selected} /> : null}
    </Fragment>
  );
};
