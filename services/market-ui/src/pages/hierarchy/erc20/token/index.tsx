import { FC, Fragment } from "react";
import { Grid } from "@mui/material";

import { Breadcrumbs, PageHeader, Spinner } from "@gemunion/mui-page-layout";
import { RichTextDisplay } from "@gemunion/mui-rte";
import { useCollection } from "@gemunion/react-hooks";
import { emptyStateString } from "@gemunion/draft-js-utils";
import type { ITemplate, IToken } from "@framework/types";

import { CommonErc20TokenPanel } from "./common-token-panel";
import { StyledDescription, StyledImage } from "./styled";

export const Erc20Token: FC = () => {
  const { selected, isLoading } = useCollection<IToken>({
    baseUrl: "/erc20/tokens",
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
      <Breadcrumbs path={["dashboard", "erc20", "erc20.token"]} data={[{}, {}, selected.template]} />

      <PageHeader message="pages.erc20.token.title" data={selected.template} />

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
              <CommonErc20TokenPanel token={selected} />
            </>
          ) : null}
        </Grid>
      </Grid>
    </Fragment>
  );
};
