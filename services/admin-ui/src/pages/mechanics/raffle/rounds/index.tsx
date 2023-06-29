import { FC } from "react";
import { Grid, IconButton, List, ListItem, ListItemSecondaryAction, ListItemText, Pagination } from "@mui/material";
import { Visibility } from "@mui/icons-material";

import { Breadcrumbs, PageHeader, ProgressOverlay } from "@gemunion/mui-page-layout";
import { useCollection } from "@gemunion/react-hooks";
import type { ISearchDto } from "@gemunion/types-collection";
import type { IRaffleRound } from "@framework/types";

import { RaffleRoundViewDialog } from "./view";
import { CronExpression } from "@framework/types";

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

      <PageHeader message="pages.raffle.rounds.title" />

      <ProgressOverlay isLoading={isLoading}>
        <List>
          {rows.map((round, i) => (
            <ListItem key={i}>
              <ListItemText sx={{ width: 0.2 }}>{round.contract?.title}</ListItemText>
              <ListItemText sx={{ width: 0.6 }}>
                {round.roundId} - {round.number || "awaiting results"}
              </ListItemText>
              <ListItemText sx={{ width: 0.3 }}>
                {round.contract?.parameters.schedule
                  ? Object.keys(CronExpression)[
                      Object.values(CronExpression).indexOf(
                        round.contract?.parameters.schedule as unknown as CronExpression,
                      )
                    ]
                  : ""}
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
