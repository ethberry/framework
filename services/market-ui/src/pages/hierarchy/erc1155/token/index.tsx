import { FC, Fragment } from "react";
import { Grid } from "@mui/material";

import { Breadcrumbs, PageHeader, Spinner } from "@ethberry/mui-page-layout";
import { RichTextDisplay } from "@ethberry/mui-rte";
import { useCollection } from "@ethberry/provider-collection";
import { emptyStateString } from "@ethberry/draft-js-utils";
import type { IBalance, ITemplate, IToken } from "@framework/types";

import { DismantleTokenPanel } from "../../../mechanics/gaming/recipes/dismantle/dismantle-token-panel";
import { TokenHistory } from "../../../../components/common/token-history";
import { OpenSeaTokenPanel } from "../../erc721/token/opensea-token-panel";
import { CommonTokenPanel } from "./common-token-panel";
import { StyledDescription, StyledImage } from "./styled";

export const Erc1155Token: FC = () => {
  const { selected, isLoading } = useCollection<IToken>({
    baseUrl: "/erc1155/tokens",
    empty: {
      balance: [
        {
          amount: "0",
        } as IBalance,
      ],
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
      <Breadcrumbs path={["dashboard", "erc1155", "erc1155.token"]} data={[{}, {}, selected.template]} />

      <PageHeader message="pages.erc1155.token.title" data={selected.template} />

      <Grid container>
        <Grid item xs={12} sm={9}>
          <StyledImage component="img" src={selected.template!.imageUrl} alt="Gemunion token image" />
          <StyledDescription component="div">
            <RichTextDisplay data={selected.template!.description} />
          </StyledDescription>
        </Grid>
        <Grid item xs={12} sm={3}>
          {selected.templateId ? (
            <>
              <CommonTokenPanel token={selected} />
              <DismantleTokenPanel token={selected} />
              <OpenSeaTokenPanel token={selected} />
            </>
          ) : null}
        </Grid>
      </Grid>

      {selected.id ? <TokenHistory token={selected} /> : null}
    </Fragment>
  );
};
