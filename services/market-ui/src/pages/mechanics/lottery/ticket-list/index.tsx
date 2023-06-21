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
import { ILotteryTicketSearchDto, ITicketLottery } from "@framework/types";
import { useCollection } from "@gemunion/react-hooks";

import { LotteryTicketSearchForm } from "./form";
import { LotteryTicketViewDialog } from "./view";
import { decodeNumbers, decodeNumbersToArr, getWinners } from "./utils";
import { LotteryRewardButton } from "../../../../components/buttons";

export const LotteryTicketList: FC = () => {
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
  } = useCollection<ITicketLottery, ILotteryTicketSearchDto>({
    baseUrl: "/lottery/ticket",
    empty: {
      round: {
        numbers: [],
      },
    },
    search: {
      roundIds: [],
    },
  });

  return (
    <Grid>
      <Breadcrumbs path={["dashboard", "lottery", "lottery.tickets"]} />

      <PageHeader message="pages.lottery.tickets.title">
        <Button startIcon={<FilterList />} onClick={handleToggleFilters} data-testid="ToggleFilterButton">
          <FormattedMessage id={`form.buttons.${isFiltersOpen ? "hideFilters" : "showFilters"}`} />
        </Button>
      </PageHeader>

      <LotteryTicketSearchForm onSubmit={handleSearch} initialValues={search} open={isFiltersOpen} />

      <ProgressOverlay isLoading={isLoading}>
        <List sx={{ overflowX: "scroll" }}>
          {rows.map((ticket, i) => (
            <ListItem key={i} sx={{ flexWrap: "wrap" }}>
              <ListItemText sx={{ width: 0.2 }}>{ticket.id}</ListItemText>
              <ListItemText sx={{ width: 0.3 }}>{decodeNumbers(ticket.metadata.NUMBERS)}</ListItemText>
              <ListItemText sx={{ width: 0.2 }}>
                {"Round #"}
                {ticket.round.roundId}
              </ListItemText>
              <ListItemText sx={{ width: 0.2 }}>
                {getWinners(decodeNumbersToArr(ticket.metadata.NUMBERS), ticket.round.numbers || [])}
              </ListItemText>
              <ListItemSecondaryAction>
                <LotteryRewardButton ticket={ticket} />
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
