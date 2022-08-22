import { FC } from "react";
import { Grid, IconButton, List, ListItem, ListItemSecondaryAction, ListItemText, Pagination } from "@mui/material";
import { Visibility } from "@mui/icons-material";

import { Breadcrumbs, PageHeader, ProgressOverlay } from "@gemunion/mui-page-layout";
import { useCollection } from "@gemunion/react-hooks";
import { ISearchDto } from "@gemunion/types-collection";
import { ILotteryTicket } from "@framework/types";

import { LotteryTicketViewDialog } from "./view";
import { getNumbers } from "../utils";

export const LotteryTickets: FC = () => {
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
  } = useCollection<ILotteryTicket, ISearchDto>({
    baseUrl: "/lottery/tickets",
    empty: {
      numbers: [],
    },
  });

  return (
    <Grid>
      <Breadcrumbs path={["dashboard", "lottery", "lottery.tickets"]} />

      <PageHeader message="pages.lottery.tickets.title" />

      <ProgressOverlay isLoading={isLoading}>
        <List>
          {rows.map((round, i) => (
            <ListItem key={i}>
              <ListItemText>
                {round.id} - {getNumbers(round)}
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

      <LotteryTicketViewDialog
        onCancel={handleViewCancel}
        onConfirm={handleViewConfirm}
        open={isViewDialogOpen}
        initialValues={selected}
      />
    </Grid>
  );
};
