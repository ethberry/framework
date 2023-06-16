import { FC } from "react";
import { Grid, IconButton, List, ListItem, ListItemSecondaryAction, ListItemText, Pagination } from "@mui/material";
import { Visibility } from "@mui/icons-material";

import { Breadcrumbs, PageHeader, ProgressOverlay } from "@gemunion/mui-page-layout";
import { useCollection } from "@gemunion/react-hooks";
import type { ISearchDto } from "@gemunion/types-collection";
import type { IRaffleRound } from "@framework/types";

import { RaffleRoundViewDialog } from "./view";
import { RaffleRoundEndButton, RaffleRoundStartButton, RaffleScheduleButton } from "../../../../components/buttons";

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
  } = useCollection<IRaffleRound, ISearchDto>({
    baseUrl: "/raffle/rounds",
    empty: {
      maxTickets: 0,
    },
  });

  return (
    <Grid>
      <Breadcrumbs path={["dashboard", "raffle", "raffle.rounds"]} />

      <PageHeader message="pages.raffle.rounds.title">
        <RaffleRoundStartButton />
        <RaffleRoundEndButton />
        <RaffleScheduleButton />
      </PageHeader>

      <ProgressOverlay isLoading={isLoading}>
        <List>
          {rows.map((round, i) => (
            <ListItem key={i}>
              <ListItemText>
                {round.roundId} - {round.number || "awaiting results"}
              </ListItemText>
              <ListItemSecondaryAction>
                <IconButton onClick={handleView(round)}>
                  <Visibility />
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
          ))}
        </List>
      </ProgressOverlay>

      <Pagination
        sx={{ mt: 2 }}
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
