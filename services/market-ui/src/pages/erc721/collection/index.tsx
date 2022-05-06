import { FC, Fragment } from "react";
import { Avatar, Box, Typography } from "@mui/material";
import { Skeleton } from "@mui/lab";

import { Spinner } from "@gemunion/mui-progress";
import { PageHeader } from "@gemunion/mui-page-header";
import { IErc721Collection, IErc721CollectionSearchDto } from "@framework/types";
import { RichTextDisplay } from "@gemunion/mui-rte";
import { Breadcrumbs } from "@gemunion/mui-breadcrumbs";
import { emptyStateString } from "@gemunion/draft-js-utils";
import { useCollection } from "@gemunion/react-hooks";

import { Erc721TemplateList } from "../template-list";
import { useStyles } from "./styles";

export const Erc721Collection: FC = () => {
  const { selected, isLoading } = useCollection<IErc721Collection, IErc721CollectionSearchDto>({
    baseUrl: "/erc721-collections",
    empty: {
      title: "",
      description: emptyStateString,
    },
    redirect: () => "",
  });

  const classes = useStyles();

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <Fragment>
      <Breadcrumbs path={["dashboard", "erc721-collections", "erc721-collection"]} data={[{}, {}, selected]} />

      <PageHeader message="pages.erc721-collection.title" data={selected} />

      <Box display="flex">
        <Box margin={1}>
          {isLoading ? (
            <Skeleton variant="circular">
              <Avatar />
            </Skeleton>
          ) : (
            <Avatar className={classes.avatar} src={selected.imageUrl} />
          )}
        </Box>
        <Box width="100%">
          {isLoading ? (
            <Skeleton width="100%">
              <Typography>.</Typography>
            </Skeleton>
          ) : (
            <Typography variant="body2" color="textSecondary" component="div" className={classes.preview}>
              <RichTextDisplay data={selected.description} />
            </Typography>
          )}
        </Box>
      </Box>

      <Erc721TemplateList embedded={true} />
    </Fragment>
  );
};
