import { FC } from "react";
import { Button, Grid, List, ListItem, ListItemText } from "@mui/material";
import { FilterList, Visibility } from "@mui/icons-material";
import { FormattedMessage } from "react-intl";

import { Breadcrumbs, PageHeader, ProgressOverlay } from "@gemunion/mui-page-layout";
import { useCollection } from "@gemunion/react-hooks";
import { ListAction, ListActions } from "@framework/mui-lists";
import { StyledPagination } from "@framework/styled";
import type { ILotteryRound, ILotteryToken, ILotteryTokenSearchDto } from "@framework/types";

import { LotteryTokenViewDialog } from "./view";
import { decodeNumbers, decodeNumbersToArr, getWinners } from "../utils";
import { LotteryTokenSearchForm } from "./form";

export const LotteryTokens: FC = () => {
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
  } = useCollection<ILotteryToken, ILotteryTokenSearchDto>({
    baseUrl: "/lottery/tokens",
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
          <FormattedMessage
            id={`form.buttons.${isFiltersOpen ? "hideFilters" : "showFilters"}`}
            data-testid="ToggleFiltersButton"
          />
        </Button>
      </PageHeader>

      <LotteryTokenSearchForm onSubmit={handleSearch} initialValues={search} open={isFiltersOpen} />

      <ProgressOverlay isLoading={isLoading}>
        <List>
          {rows.map(token => (
            <ListItem key={token.id}>
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
                <ListAction onClick={handleView(token)} icon={Visibility} message="form.tips.view" />
              </ListActions>
            </ListItem>
          ))}
        </List>
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
        open={isViewDialogOpen}
        initialValues={selected}
      />
    </Grid>
  );
};
