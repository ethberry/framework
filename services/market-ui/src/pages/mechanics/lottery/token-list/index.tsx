import { FC } from "react";
import { Button, Grid, Hidden, List, ListItem, ListItemText } from "@mui/material";
import { FilterList, Visibility } from "@mui/icons-material";
import { FormattedMessage } from "react-intl";

import { ListAction, ListActions } from "@framework/mui-lists";
import { StyledPagination } from "@framework/styled";
import { ILotteryToken, ILotteryTokenSearchDto, TokenStatus } from "@framework/types";
import { Breadcrumbs, PageHeader, ProgressOverlay } from "@gemunion/mui-page-layout";
import { useCollection } from "@gemunion/react-hooks";

import { LotteryRewardButton } from "../../../../components/buttons";
import { decodeNumbers, decodeNumbersToArr, getWinners } from "./utils";
import { LotteryTokenSearchForm } from "./form";
import { LotteryTokenViewDialog } from "./view";

export const LotteryTokenList: FC = () => {
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
  } = useCollection<ILotteryToken, ILotteryTokenSearchDto>({
    baseUrl: "/lottery/tokens",
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
        <List>
          {rows.map(token => (
            <ListItem key={token.id}>
              <ListItemText sx={{ flex: 1 }}>{token.round?.contract?.title}</ListItemText>
              <Hidden mdDown>
                <ListItemText sx={{ flex: 1 }}>{token.id}</ListItemText>
                <ListItemText sx={{ flex: 1 }}>{decodeNumbers(token.metadata.NUMBERS)}</ListItemText>
              </Hidden>
              <ListItemText sx={{ flex: 1 }}>
                {"Round #"}
                {token.round.roundId}
              </ListItemText>
              <Hidden smDown>
                <ListItemText sx={{ flex: 1 }}>
                  {getWinners(decodeNumbersToArr(token.metadata.NUMBERS), token.round.numbers || [])}
                </ListItemText>
              </Hidden>
              <ListActions>
                <LotteryRewardButton token={token} disabled={token.tokenStatus !== TokenStatus.MINTED} />
                <ListAction onClick={handleView(token)} message="form.tips.view" icon={Visibility} />
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
