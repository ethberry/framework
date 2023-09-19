import { FC, Fragment } from "react";
import { Avatar, Box, Typography } from "@mui/material";
import { Skeleton } from "@mui/lab";

import { Breadcrumbs, PageHeader, Spinner } from "@gemunion/mui-page-layout";
import { RichTextDisplay } from "@gemunion/mui-rte";
import { emptyStateString } from "@gemunion/draft-js-utils";
import { useCollection } from "@gemunion/react-hooks";
import type { IContract } from "@framework/types";

import { CraftContactPanel } from "../../../mechanics/recipes/craft/craft-contact-panel";
import { Erc1155TemplateList } from "../template-list";

export const Erc1155Contract: FC = () => {
  const { selected, isLoading } = useCollection<IContract>({
    baseUrl: "/erc1155/contracts",
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
      <Breadcrumbs path={["dashboard", "erc1155", "erc1155.contract"]} data={[{}, {}, { title: selected.title }]} />

      <PageHeader message="pages.erc1155.contract.title" data={selected}>
        <CraftContactPanel contract={selected} />
      </PageHeader>

      <Box display="flex">
        <Box margin={1}>
          {isLoading ? (
            <Skeleton variant="circular">
              <Avatar />
            </Skeleton>
          ) : (
            <Avatar sx={{ width: 200, height: 200 }} src={selected.imageUrl} />
          )}
        </Box>
        <Box width="100%">
          {isLoading ? (
            <Skeleton width="100%">
              <Typography>.</Typography>
            </Skeleton>
          ) : (
            <Typography variant="body2" color="textSecondary" component="div">
              <RichTextDisplay data={selected.description} />
            </Typography>
          )}
        </Box>
      </Box>

      <Erc1155TemplateList embedded />
    </Fragment>
  );
};
