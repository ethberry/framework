import { FC, Fragment } from "react";
import { Grid } from "@mui/material";

import { Breadcrumbs, PageHeader, Spinner } from "@gemunion/mui-page-layout";
import { RichTextDisplay } from "@gemunion/mui-rte";
import { useCollection } from "@gemunion/react-hooks";
import { emptyStateString } from "@gemunion/draft-js-utils";
import type { ITemplate } from "@framework/types";

import { CraftTemplatePanel } from "../../../mechanics/recipes/craft/craft-template-panel";
import { Erc721TemplatePanel } from "../../../hierarchy/erc721/template/template-panel";
import { StyledDescription, StyledImage } from "./styled";

export const Template: FC = () => {
  const { selected, isLoading } = useCollection<ITemplate>({
    baseUrl: "/templates",
    empty: {
      title: "",
      description: emptyStateString,
    },
  });

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <Fragment>
      <Breadcrumbs path={["dashboard", "marketplace", "marketplace.template"]} data={[{}, {}, selected]} />

      <PageHeader message="pages.marketplace.template.title" data={selected} />

      <Grid container>
        <Grid item xs={12} sm={9}>
          <StyledImage component="img" src={selected.imageUrl} alt="Gemunion template image" />
          <StyledDescription>
            <RichTextDisplay data={selected.description} />
          </StyledDescription>
        </Grid>
        <Grid item xs={12} sm={3}>
          {selected.id ? (
            <>
              <Erc721TemplatePanel template={selected} />
              <CraftTemplatePanel template={selected} />
            </>
          ) : null}
        </Grid>
      </Grid>
    </Fragment>
  );
};
