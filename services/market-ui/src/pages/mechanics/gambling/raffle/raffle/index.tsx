import { FC } from "react";
import { Avatar, Box, Grid, Typography } from "@mui/material";
import { Skeleton } from "@mui/lab";

import { Breadcrumbs, PageHeader, Spinner } from "@ethberry/mui-page-layout";
import { RichTextDisplay } from "@ethberry/mui-rte";
import { emptyStateString } from "@ethberry/draft-js-utils";
import { useCollection } from "@ethberry/provider-collection";
import { StyledAvatar } from "@framework/styled";
import type { IContract, IContractSearchDto } from "@framework/types";

import { RafflePurchase } from "./purchase";
import { RaffleStatistic } from "./statistics";

export const RaffleContract: FC = () => {
  const { selected, isLoading } = useCollection<IContract, IContractSearchDto>({
    baseUrl: "/raffle/contracts",
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
    <Grid>
      <Breadcrumbs path={["dashboard", "raffle", "raffle.contract"]} data={[{}, {}, selected]} />

      <PageHeader message="pages.raffle.contract.title" data={selected} />

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

      <RafflePurchase contract={selected} />
      <RaffleStatistic contract={selected} />
    </Grid>
  );
};
