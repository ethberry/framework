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
import type { ILotteryRound, ILotteryTicketSearchDto, IToken } from "@framework/types";

import { LotteryTicketViewDialog } from "./view";
import { getWinners, decodeNumbers, decodeNumbersToArr } from "../utils";
import { LotteryTicketSearchForm } from "./form";

export interface ILotteryTicket extends IToken {
  round: Partial<ILotteryRound>;
}

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
      // metadata: {
      //   NUMBERS: "",
      // },
      round: {
        numbers: [],
      },
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
          {rows.map((ticket, i) => (
            <ListItem key={i}>
              <ListItemText sx={{ width: 0.2 }}>{ticket.id}</ListItemText>
              <ListItemText sx={{ width: 0.3 }}>{decodeNumbers(ticket.metadata.NUMBERS)}</ListItemText>
              <ListItemText sx={{ width: 0.3 }}>
                {"Round #"}
                {ticket.round.roundId}
              </ListItemText>
              <ListItemText>
                {getWinners(decodeNumbersToArr(ticket.metadata.NUMBERS), ticket.round.numbers || [])}
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

      <LotteryTicketViewDialog
        onCancel={handleViewCancel}
        onConfirm={handleViewConfirm}
        open={isViewDialogOpen}
        initialValues={selected}
      />
    </Grid>
  );
};
