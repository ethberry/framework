import { FC, Fragment } from "react";
import { Avatar, Box, Typography } from "@mui/material";
import { Skeleton } from "@mui/lab";

import { Breadcrumbs, PageHeader, Spinner } from "@gemunion/mui-page-layout";
import { IContract, IContractSearchDto } from "@framework/types";
import { RichTextDisplay } from "@gemunion/mui-rte";
import { emptyStateString } from "@gemunion/draft-js-utils";
import { useCollection } from "@gemunion/react-hooks";

import { MysteryBoxList } from "../mysterybox-list";
import { useStyles } from "./styles";

export const MysteryboxContract: FC = () => {
  const { selected, isLoading } = useCollection<IContract, IContractSearchDto>({
    baseUrl: "/mystery-contracts",
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
      <Breadcrumbs path={["dashboard", "mystery.contracts", "mystery.contract"]} data={[{}, {}, selected]} />

      <PageHeader message="pages.mystery.contract.title" data={selected} />

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

      <MysteryBoxList embedded />
    </Fragment>
  );
};
