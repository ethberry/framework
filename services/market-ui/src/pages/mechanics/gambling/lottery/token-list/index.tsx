import { FC } from "react";
import { Button, Grid, Hidden, ListItemText } from "@mui/material";
import { FilterList, Visibility } from "@mui/icons-material";
import { FormattedMessage } from "react-intl";

import { ListAction, ListActions, StyledListItem, StyledListWrapper, StyledPagination } from "@framework/styled";
import { ILotteryToken, ILotteryTicketTokenSearchDto } from "@framework/types";
import { Breadcrumbs, PageHeader, ProgressOverlay } from "@gemunion/mui-page-layout";
import { useCollection, CollectionActions } from "@gemunion/provider-collection";

import { LotteryRewardButton } from "../../../../../components/buttons";
import { decodeNumbers, decodeNumbersToArr, getWinners } from "./utils";
import { LotteryTokenSearchForm } from "./form";
import { LotteryTokenViewDialog } from "./view";

export const LotteryTicketTokenList: FC = () => {
  const {
    rows,
    count,
    search,
    action,
    selected,
    isLoading,
    isFiltersOpen,
    handleToggleFilters,
    handleView,
    handleViewConfirm,
    handleViewCancel,
    handleSearch,
    handleChangePage,
  } = useCollection<ILotteryToken, ILotteryTicketTokenSearchDto>({
    baseUrl: "/lottery/ticket/tokens",
    empty: {
      round: {
        numbers: [],
      },
      metadata: {
        PRIZE: 0,
        NUMBERS: 0,
      },
    },
    search: {
      roundIds: [],
    },
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
              <ListItemText sx={{ flex: 1 }}>{token.round?.contract?.title}</ListItemText>
              <Hidden mdDown>
                <ListItemText sx={{ flex: 0.6 }}>{token.id}</ListItemText>
                <ListItemText sx={{ flex: 1 }}>{decodeNumbers(token.metadata.NUMBERS)}</ListItemText>
              </Hidden>
              <ListItemText sx={{ flex: 0.6 }}>
                {"Round #"}
                {token.round.roundId}
              </ListItemText>
              <Hidden smDown>
                <ListItemText sx={{ flex: 1 }}>
                  {getWinners(decodeNumbersToArr(token.metadata.NUMBERS), token.round.numbers || [])}
                </ListItemText>
              </Hidden>
              <ListActions>
                <LotteryRewardButton token={token} />
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
