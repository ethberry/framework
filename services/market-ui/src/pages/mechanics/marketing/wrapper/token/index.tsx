import { FC, Fragment } from "react";
import { Grid } from "@mui/material";

import { Breadcrumbs, PageHeader, Spinner } from "@ethberry/mui-page-layout";
import { RichTextDisplay } from "@ethberry/mui-rte";
import { useCollection } from "@ethberry/provider-collection";
import { emptyStateString } from "@ethberry/draft-js-utils";
import type { ITemplate, IToken } from "@framework/types";

import { CommonTokenPanel } from "../../../../hierarchy/erc721/token/common-token-panel";
import { WrapperTokenPanel } from "./wrapper-token-panel";
import { StyledDescription, StyledImage } from "./styled";

export const WrapperToken: FC = () => {
  const { selected, isLoading } = useCollection<IToken>({
    baseUrl: "/wrapper/tokens",
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
      <Breadcrumbs path={["dashboard", "wrapper", "wrapper.token"]} data={[{}, {}, selected.template]} />

      <PageHeader message="pages.wrapper.token.title" data={selected.template} />

      <Grid container>
        <Grid item xs={9}>
          <StyledImage component="img" src={selected.template!.imageUrl} />
          <StyledDescription component="div">
            <RichTextDisplay data={selected.template!.description} />
          </StyledDescription>
        </Grid>
        <Grid item xs={12} sm={3}>
          {selected.templateId ? (
            <>
              <CommonTokenPanel token={selected} />
              <WrapperTokenPanel token={selected} />
            </>
          ) : null}
        </Grid>

        <Grid item xs={3}></Grid>
      </Grid>
    </Fragment>
  );
};
