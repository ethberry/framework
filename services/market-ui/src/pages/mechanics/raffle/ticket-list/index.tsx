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
import { IRaffleTicket, IRaffleTicketSearchDto } from "@framework/types";
import { useCollection } from "@gemunion/react-hooks";

import { RaffleTicketSearchForm } from "./form";
import { RaffleTicketViewDialog } from "./view";
import { RaffleRewardButton } from "../../../../components/buttons";

export const RaffleTicketList: FC = () => {
  const {
    rows,
    count,
    search,
    selected,
    isLoading,
    isFiltersOpen,
    handleToggleFilters,
    isViewDialogOpen,
    handleView,
    handleViewConfirm,
    handleViewCancel,
    handleSearch,
    handleChangePage,
  } = useCollection<IRaffleTicket, IRaffleTicketSearchDto>({
    baseUrl: "/raffle/ticket",
    empty: {},
    search: {
      roundIds: [],
    },
  });

  return (
    <Grid>
      <Breadcrumbs path={["dashboard", "raffle", "raffle.tickets"]} />

      <PageHeader message="pages.raffle.tickets.title">
        <Button startIcon={<FilterList />} onClick={handleToggleFilters} data-testid="ToggleFilterButton">
          <FormattedMessage id={`form.buttons.${isFiltersOpen ? "hideFilters" : "showFilters"}`} />
        </Button>
      </PageHeader>

      <RaffleTicketSearchForm onSubmit={handleSearch} initialValues={search} open={isFiltersOpen} />

      <ProgressOverlay isLoading={isLoading}>
        <List sx={{ overflowX: "scroll" }}>
          {rows.map((ticket, i) => (
            <ListItem key={i} sx={{ flexWrap: "wrap" }}>
              <ListItemText sx={{ width: 0.6 }}>{ticket.roundId}</ListItemText>
              <ListItemText sx={{ width: { xs: 0.6, md: 0.2 } }}>{"winner"}</ListItemText>
              <ListItemSecondaryAction>
                <RaffleRewardButton ticket={ticket} />
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
