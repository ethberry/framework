import { FC, Fragment } from "react";
import { Avatar, Box, Typography } from "@mui/material";
import { Skeleton } from "@mui/lab";

import { Breadcrumbs, PageHeader, Spinner } from "@gemunion/mui-page-layout";
import { RichTextDisplay } from "@gemunion/mui-rte";
import { emptyStateString } from "@gemunion/draft-js-utils";
import { useCollection } from "@gemunion/react-hooks";
import { StyledAvatar } from "@framework/styled";
import type { IContract, IContractSearchDto } from "@framework/types";

import { LotteryPurchase } from "./purchase";
import { LotteryStatistic } from "./statistics";

export const LotteryContract: FC = () => {
  const { selected, isLoading } = useCollection<IContract, IContractSearchDto>({
    baseUrl: "/lottery/contracts",
    empty: {
      title: "",
      description: emptyStateString,
      parameters: {
        commission: 0,
      },
    },
    redirect: () => "",
  });

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <Fragment>
      <Breadcrumbs path={["dashboard", "lottery", "lottery.contract"]} data={[{}, {}, selected]} />

      <PageHeader message="pages.lottery.contract.title" data={selected} />

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

      <LotteryPurchase contract={selected} />
      <LotteryStatistic contract={selected} />
    </Fragment>
  );
};
