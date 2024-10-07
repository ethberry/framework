import { FC, Fragment } from "react";
import { Grid } from "@mui/material";

import { Breadcrumbs, PageHeader, Spinner } from "@ethberry/mui-page-layout";
import { RichTextDisplay } from "@ethberry/mui-rte";
import { emptyStateString } from "@ethberry/draft-js-utils";
import { useCollection } from "@ethberry/provider-collection";
import type { ITemplate } from "@framework/types";

import { CraftTemplatePanel } from "../../../mechanics/gaming/recipes/craft/craft-template-panel";
import { StyledDescription, StyledImage } from "./styled";
import { Erc1155TemplatePanel } from "./template-panel";

export const Erc1155Template: FC = () => {
  const { selected, isLoading } = useCollection<ITemplate>({
    baseUrl: "/erc1155/templates",
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
      <Breadcrumbs path={["dashboard", "erc1155", "erc1155.template"]} data={[{}, {}, selected]} />

      <PageHeader message="pages.erc1155.template.title" data={selected} />

      <Grid container>
        <Grid item xs={12} sm={9}>
          <StyledImage component="img" src={selected.imageUrl} alt="Gemunion template image" />
          <StyledDescription component="div">
            <RichTextDisplay data={selected.description} />
          </StyledDescription>
        </Grid>
        <Grid item xs={12} sm={3}>
          {selected.id ? (
            <>
              <Erc1155TemplatePanel template={selected} />
              <CraftTemplatePanel template={selected} />
            </>
          ) : null}
        </Grid>
      </Grid>
    </Fragment>
  );
};
