import { FC, Fragment } from "react";
import { Grid } from "@mui/material";

import { Breadcrumbs, PageHeader, Spinner } from "@ethberry/mui-page-layout";
import { RichTextDisplay } from "@ethberry/mui-rte";
import { useCollection } from "@ethberry/provider-collection";
import { emptyStateString } from "@ethberry/draft-js-utils";
import type { ITemplate, IToken } from "@framework/types";

import { TokenHistory } from "../../../../../components/common/token-history";
import { CommonTokenPanel } from "../../../../hierarchy/erc721/token/common-token-panel";
import { MysteryTokenPanel } from "./mystery-token-panel";
import { StyledDescription, StyledImage } from "./styled";

export const MysteryBoxToken: FC = () => {
  const { selected, isLoading } = useCollection<IToken>({
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
    <Grid>
      <Breadcrumbs path={["dashboard", "mystery", "mystery.token"]} data={[{}, {}, selected.template]} />

      <PageHeader message="pages.mystery.token.title" data={selected.template} />

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
              <MysteryTokenPanel token={selected} />
            </>
          ) : null}
        </Grid>
      </Grid>

      {selected.id ? <TokenHistory token={selected} /> : null}
    </Grid>
  );
};
