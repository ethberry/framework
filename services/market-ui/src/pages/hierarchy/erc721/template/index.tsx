import { FC, Fragment } from "react";
import { Box, Grid, Typography } from "@mui/material";

import { Breadcrumbs, PageHeader, Spinner } from "@gemunion/mui-page-layout";
import { RichTextDisplay } from "@gemunion/mui-rte";
import { useCollection } from "@gemunion/react-hooks";
import { emptyStateString } from "@gemunion/draft-js-utils";
import type { ITemplate } from "@framework/types";

import { CraftTemplatePanel } from "../../../mechanics/recipes/craft/craft-template-panel";
import { CommonTemplatePanel } from "./common-template-panel";

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
          <Box
            component="img"
            src={selected.imageUrl}
            alt="Gemunion template image"
            sx={{ display: "block", mx: "auto", maxWidth: "70%" }}
          />
          <Typography variant="body2" color="textSecondary" component="div" sx={{ my: 1 }}>
            <RichTextDisplay data={selected.description} />
          </Typography>
        </Grid>
        <Grid item xs={12} sm={3}>
          {selected.id ? (
            <>
              <CommonTemplatePanel template={selected} />
              <CraftTemplatePanel template={selected} />
            </>
          ) : null}
        </Grid>
      </Grid>
    </Fragment>
  );
};
