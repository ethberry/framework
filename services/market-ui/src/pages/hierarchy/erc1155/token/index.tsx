import { FC, Fragment } from "react";
import { Box, Grid, Typography } from "@mui/material";

import { Breadcrumbs, PageHeader, Spinner } from "@gemunion/mui-page-layout";
import { RichTextDisplay } from "@gemunion/mui-rte";
import { useCollection } from "@gemunion/react-hooks";
import { emptyStateString } from "@gemunion/draft-js-utils";
import type { IBalance, ITemplate, IToken } from "@framework/types";

import { DismantleTokenPanel } from "../../../mechanics/recipes/dismantle/dismantle-token-panel";
import { CommonTokenPanel } from "./common-token-panel";

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
          <Box
            component="img"
            src={selected.template!.imageUrl}
            alt="Gemunion token image"
            sx={{ display: "block", mx: "auto", maxWidth: "70%" }}
          />
          <Typography variant="body2" color="textSecondary" component="div" sx={{ my: 1 }}>
            <RichTextDisplay data={selected.template!.description} />
          </Typography>
        </Grid>
        <Grid item xs={12} sm={3}>
          {selected.templateId ? (
            <>
              <CommonTokenPanel token={selected} />
              <DismantleTokenPanel token={selected} />
            </>
          ) : null}
        </Grid>
      </Grid>
    </Fragment>
  );
};
