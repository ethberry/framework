import { FC } from "react";
import { Button, Grid, ListItemText } from "@mui/material";
import { FilterList, Visibility } from "@mui/icons-material";
import { FormattedMessage } from "react-intl";

import { Breadcrumbs, PageHeader, ProgressOverlay } from "@gemunion/mui-page-layout";
import { useCollection, CollectionActions } from "@gemunion/provider-collection";
import { ListAction, ListActions, StyledListItem, StyledListWrapper, StyledPagination } from "@framework/styled";
import type { ILotteryRound, ILotteryToken, ILotteryTicketTokenSearchDto } from "@framework/types";

import { decodeNumbers, decodeNumbersToArr, getWinners } from "../utils";
import { LotteryTokenViewDialog } from "./view";
import { LotteryTokenSearchForm } from "./form";

export const LotteryTicketTokens: FC = () => {
  const {
    rows,
    count,
    search,
    action,
    selected,
    isLoading,
    isFiltersOpen,
    handleView,
    handleViewConfirm,
    handleViewCancel,
    handleSearch,
    handleChangePage,
    handleToggleFilters,
  } = useCollection<ILotteryToken, ILotteryTicketTokenSearchDto>({
    baseUrl: "/lottery/ticket/tokens",
    search: {
      roundIds: [],
    },
    empty: {
      round: {
        numbers: [],
      },
    } as unknown as ILotteryRound,
  });

  return (
    <Grid>
      <Breadcrumbs path={["dashboard", "lottery", "lottery.tokens"]} />

      <PageHeader message="pages.lottery.tokens.title">
        <Button startIcon={<FilterList />} onClick={handleToggleFilters} data-testid="ToggleFilterButton">
          <FormattedMessage id={`form.buttons.${isFiltersOpen ? "hideFilters" : "showFilters"}`} />
        </Button>
      </PageHeader>

      <LotteryTokenSearchForm onSubmit={handleSearch} initialValues={search} open={isFiltersOpen} />

      <ProgressOverlay isLoading={isLoading}>
        <StyledListWrapper count={rows.length} isLoading={isLoading}>
          {rows.map(token => (
            <StyledListItem key={token.id}>
              <ListItemText sx={{ width: 0.2 }}>{token.id}</ListItemText>
              <ListItemText sx={{ width: 0.3 }}>{decodeNumbers(token.metadata.NUMBERS)}</ListItemText>
              <ListItemText sx={{ width: 0.2 }}>
                {"Round #"}
                {token.round.roundId}
              </ListItemText>
              <ListItemText sx={{ width: 0.2 }}>{token.round.contract?.title}</ListItemText>
              <ListItemText sx={{ width: 0.2 }}>
                {token.metadata.PRIZE ? "Prize " : ""}
                {getWinners(decodeNumbersToArr(token.metadata.NUMBERS), token.round.numbers || [])}
              </ListItemText>
              <ListActions>
                <ListAction onClick={handleView(token)} message="form.tips.view" icon={Visibility} />
              </ListActions>
            </StyledListItem>
          ))}
        </StyledListWrapper>
      </ProgressOverlay>

      <StyledPagination
        shape="rounded"
        page={search.skip / search.take + 1}
        count={Math.ceil(count / search.take)}
        onChange={handleChangePage}
      />

      <LotteryTokenViewDialog
        onCancel={handleViewCancel}
        onConfirm={handleViewConfirm}
        open={action === CollectionActions.view}
        initialValues={selected}
      />
    </Grid>
  );
};
