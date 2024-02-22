import { FC } from "react";
import { Grid, List, ListItemText } from "@mui/material";
import { Visibility } from "@mui/icons-material";

import { Breadcrumbs, PageHeader, ProgressOverlay } from "@gemunion/mui-page-layout";
import { useCollection } from "@gemunion/react-hooks";
import type { ISearchDto } from "@gemunion/types-collection";
import { ListAction, ListActions, StyledListItem, StyledPagination } from "@framework/styled";
import type { IRaffleRound } from "@framework/types";
import { ContractStatus } from "@framework/types";

import { RaffleReleaseButton } from "../../../../../components/buttons/mechanics/raffle/contract/release";
import { RaffleRoundEndButton } from "../../../../../components/buttons/mechanics/raffle/contract/round-end";
import { RaffleRoundViewDialog } from "./view";

export const RaffleRounds: FC = () => {
  const {
    rows,
    count,
    search,
    selected,
    isLoading,
    isViewDialogOpen,
    handleView,
    handleViewConfirm,
    handleViewCancel,
    handleChangePage,
    handleRefreshPage,
  } = useCollection<IRaffleRound, ISearchDto>({
    baseUrl: "/raffle/rounds",
    empty: {
      maxTickets: 0,
    },
  });

  return (
    <Grid>
      <Breadcrumbs path={["dashboard", "raffle", "raffle.rounds"]} />

      <PageHeader message="pages.raffle.rounds.title" />

      <ProgressOverlay isLoading={isLoading}>
        <List>
          {rows.map(round => (
            <StyledListItem key={round.id}>
              <ListItemText sx={{ width: 0.2 }}>
                {round.contract?.title} #{round.roundId}
              </ListItemText>
              <ListActions>
                <ListAction onClick={handleView(round)} message="form.tips.view" icon={Visibility} />
                <RaffleReleaseButton round={round} onRefreshPage={handleRefreshPage} />
                <RaffleRoundEndButton
                  contract={round.contract!}
                  disabled={
                    round.contract!.contractStatus === ContractStatus.INACTIVE ||
                    round.contract!.parameters.roundId !== round.id
                  }
                />
              </ListActions>
            </StyledListItem>
          ))}
        </List>
      </ProgressOverlay>

      <StyledPagination
        shape="rounded"
        page={search.skip / search.take + 1}
        count={Math.ceil(count / search.take)}
        onChange={handleChangePage}
      />

      <RaffleRoundViewDialog
        onCancel={handleViewCancel}
        onConfirm={handleViewConfirm}
        open={isViewDialogOpen}
        initialValues={selected}
      />
    </Grid>
  );
};