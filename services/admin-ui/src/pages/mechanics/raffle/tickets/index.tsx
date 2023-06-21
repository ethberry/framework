import { FC } from "react";
import {
  Button,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemSecondaryAction,
  ListItemText,
  Pagination,
} from "@mui/material";
import { FilterList, Visibility } from "@mui/icons-material";
import { FormattedMessage } from "react-intl";

import { Breadcrumbs, PageHeader, ProgressOverlay } from "@gemunion/mui-page-layout";
import { useCollection } from "@gemunion/react-hooks";
import type { IRaffleTicketSearchDto, ITicketRaffle } from "@framework/types";

import { RaffleTicketViewDialog } from "./view";
import { RaffleTicketSearchForm } from "./form";

export const RaffleTickets: FC = () => {
  const {
    rows,
    count,
    search,
    selected,
    isLoading,
    isFiltersOpen,
    isViewDialogOpen,
    handleView,
    handleViewConfirm,
    handleViewCancel,
    handleSearch,
    handleChangePage,
    handleToggleFilters,
  } = useCollection<ITicketRaffle, IRaffleTicketSearchDto>({
    baseUrl: "/raffle/tickets",
    search: {
      roundIds: [],
    },
    empty: {
      round: {
        number: "0",
      },
    },
  });

  return (
    <Grid>
      <Breadcrumbs path={["dashboard", "raffle", "raffle.tickets"]} />

      <PageHeader message="pages.raffle.tickets.title">
        <Button startIcon={<FilterList />} onClick={handleToggleFilters} data-testid="ToggleFilterButton">
          <FormattedMessage
            id={`form.buttons.${isFiltersOpen ? "hideFilters" : "showFilters"}`}
            data-testid="ToggleFiltersButton"
          />
        </Button>
      </PageHeader>

      <RaffleTicketSearchForm onSubmit={handleSearch} initialValues={search} open={isFiltersOpen} />

      <ProgressOverlay isLoading={isLoading}>
        <List>
          {rows.map((ticket, i) => (
            <ListItem key={i}>
              <ListItemText sx={{ width: 0.2 }}>{ticket.id}</ListItemText>
              <ListItemText sx={{ width: 0.2 }}>
                {"Round #"}
                {ticket.round.roundId}
              </ListItemText>
              <ListItemText sx={{ width: 0.2 }}>
                {ticket.metadata.PRIZE ? "Prize " : ""}
                {ticket.round.number === ticket.tokenId ? "winner" : ""}
              </ListItemText>

              <ListItemSecondaryAction>
                <IconButton onClick={handleView(ticket)}>
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

      <RaffleTicketViewDialog
        onCancel={handleViewCancel}
        onConfirm={handleViewConfirm}
        open={isViewDialogOpen}
        initialValues={selected}
      />
    </Grid>
  );
};
