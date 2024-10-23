import { FC, Fragment } from "react";
import { Grid } from "@mui/material";

import { Breadcrumbs, PageHeader, Spinner } from "@ethberry/mui-page-layout";
import { RichTextDisplay } from "@ethberry/mui-rte";
import { useCollection } from "@ethberry/provider-collection";
import { emptyStateString } from "@ethberry/draft-js-utils";
import type { ITemplate } from "@framework/types";

import { CraftTemplatePanel } from "../../../mechanics/gaming/recipes/craft/craft-template-panel";
import { Erc721TemplatePanel } from "./template-panel";
import { StyledDescription, StyledImage } from "./styled";

export const Erc721Template: FC = () => {
  const { selected, isLoading } = useCollection<ITemplate>({
    baseUrl: "/erc721/templates",
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
      <Breadcrumbs path={["dashboard", "erc721", "erc721.template"]} data={[{}, {}, selected]} />

      <PageHeader message="pages.erc721.template.title" data={selected} />

      <Grid container>
        <Grid item xs={12} sm={9}>
          <StyledImage component="img" src={selected.imageUrl} alt="template image" />
          <StyledDescription component="div">
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
