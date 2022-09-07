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
import type { ILotteryTicket, ILotteryTicketSearchDto } from "@framework/types";

import { LotteryTicketViewDialog } from "./view";
import { getNumbers } from "../utils";
import { LotteryTicketSearchForm } from "./form";

export const LotteryTickets: FC = () => {
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
  } = useCollection<ILotteryTicket, ILotteryTicketSearchDto>({
    baseUrl: "/lottery/tickets",
    search: {
      roundIds: [],
    },
    empty: {
      numbers: [],
    },
  });

  return (
    <Grid>
      <Breadcrumbs path={["dashboard", "lottery", "lottery.tickets"]} />

      <PageHeader message="pages.lottery.tickets.title">
        <Button startIcon={<FilterList />} onClick={handleToggleFilters} data-testid="ToggleFilterButton">
          <FormattedMessage
            id={`form.buttons.${isFiltersOpen ? "hideFilters" : "showFilters"}`}
            data-testid="ToggleFiltersButton"
          />
        </Button>
      </PageHeader>

      <LotteryTicketSearchForm onSubmit={handleSearch} initialValues={search} open={isFiltersOpen} />

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
