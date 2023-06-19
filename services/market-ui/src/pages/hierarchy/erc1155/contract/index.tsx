import { FC, Fragment } from "react";
import { FormattedMessage } from "react-intl";
import { Avatar, Box, Button, Typography } from "@mui/material";
import { Hardware } from "@mui/icons-material";
import { Skeleton } from "@mui/lab";
import { Link as RouterLink } from "react-router-dom";

import { Breadcrumbs, PageHeader, Spinner } from "@gemunion/mui-page-layout";
import { IContract } from "@framework/types";
import { RichTextDisplay } from "@gemunion/mui-rte";
import { emptyStateString } from "@gemunion/draft-js-utils";
import { useCollection } from "@gemunion/react-hooks";

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
        <Button variant="outlined" startIcon={<Hardware />} component={RouterLink} to="/craft">
          <FormattedMessage id="form.buttons.craft" />
        </Button>
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
