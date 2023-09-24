import { FC, Fragment } from "react";
import { Avatar, Box, Typography } from "@mui/material";
import { Skeleton } from "@mui/lab";

import { Breadcrumbs, PageHeader, Spinner } from "@gemunion/mui-page-layout";
import { IContract, IContractSearchDto } from "@framework/types";
import { RichTextDisplay } from "@gemunion/mui-rte";
import { emptyStateString } from "@gemunion/draft-js-utils";
import { useCollection } from "@gemunion/react-hooks";

import { TemplateList } from "../template-list";
import { CraftContactPanel } from "../../../mechanics/recipes/craft/craft-contact-panel";
import { StyledAvatar } from "./styled";

export const Contract: FC = () => {
  const { selected, isLoading } = useCollection<IContract, IContractSearchDto>({
    baseUrl: "/contracts",
    empty: {
      title: "",
      description: emptyStateString,
    },
    redirect: () => "",
  });

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <Fragment>
      <Breadcrumbs path={["dashboard", "marketplace", "marketplace.contract"]} data={[{}, {}, selected]} />

      <PageHeader message="pages.marketplace.contract.title" data={selected}>
        <CraftContactPanel contract={selected} />
      </PageHeader>

      <Box display="flex">
        <Box margin={1}>
          {isLoading ? (
            <Skeleton variant="circular">
              <Avatar />
            </Skeleton>
          ) : (
            <StyledAvatar src={selected.imageUrl} />
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

      <TemplateList embedded />
    </Fragment>
  );
};
