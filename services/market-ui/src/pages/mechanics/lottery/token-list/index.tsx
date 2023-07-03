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
import { ILotteryTokenSearchDto, ILotteryToken } from "@framework/types";
import { useCollection } from "@gemunion/react-hooks";

import { LotteryTokenSearchForm } from "./form";
import { LotteryTokenViewDialog } from "./view";
import { decodeNumbers, decodeNumbersToArr, getWinners } from "./utils";
import { LotteryRewardButton } from "../../../../components/buttons";

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
        <List sx={{ overflowX: "scroll" }}>
          {rows.map((token, i) => (
            <ListItem key={i} sx={{ flexWrap: "wrap" }}>
              <ListItemText sx={{ width: 0.2 }}>{token.round?.contract?.title}</ListItemText>
              <ListItemText sx={{ width: 0.2 }}>{token.id}</ListItemText>
              <ListItemText sx={{ width: 0.2 }}>{decodeNumbers(token.metadata.NUMBERS)}</ListItemText>
              <ListItemText sx={{ width: 0.2 }}>
                {"Round #"}
                {token.round.roundId}
              </ListItemText>
              <ListItemText sx={{ width: 0.2 }}>
                {getWinners(decodeNumbersToArr(token.metadata.NUMBERS), token.round.numbers || [])}
              </ListItemText>
              <ListItemSecondaryAction>
                <LotteryRewardButton token={token} />
                <IconButton onClick={handleView(token)}>
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

      <LotteryTokenViewDialog
        onCancel={handleViewCancel}
        onConfirm={handleViewConfirm}
        open={isViewDialogOpen}
        initialValues={selected}
      />
    </Grid>
  );
};
