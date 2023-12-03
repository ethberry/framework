import { FC } from "react";
import { Button, Grid, List, ListItemText } from "@mui/material";
import { FilterList, Visibility } from "@mui/icons-material";
import { FormattedMessage } from "react-intl";

import { ListAction, ListActions, StyledListItem, StyledPagination } from "@framework/styled";
import { IRaffleRound, IRaffleToken, IRaffleTokenSearchDto } from "@framework/types";
import { Breadcrumbs, PageHeader, ProgressOverlay } from "@gemunion/mui-page-layout";
import { useCollection } from "@gemunion/react-hooks";

import { RaffleRewardButton } from "../../../../components/buttons";
import { RaffleTokenSearchForm } from "./form";
import { RaffleTokenViewDialog } from "./view";

export const RaffleTokenList: FC = () => {
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
  } = useCollection<IRaffleToken, IRaffleTokenSearchDto>({
    baseUrl: "/raffle/tokens",
    empty: {
      round: {
        number: "0",
      } as unknown as IRaffleRound,
      metadata: {
        PRIZE: 0,
      },
    },
    search: {
      roundIds: [],
    },
  });

  return (
    <Grid>
      <Breadcrumbs path={["dashboard", "raffle", "raffle.tokens"]} />

      <PageHeader message="pages.raffle.tokens.title">
        <Button startIcon={<FilterList />} onClick={handleToggleFilters} data-testid="ToggleFilterButton">
          <FormattedMessage id={`form.buttons.${isFiltersOpen ? "hideFilters" : "showFilters"}`} />
        </Button>
      </PageHeader>

      <RaffleTokenSearchForm onSubmit={handleSearch} initialValues={search} open={isFiltersOpen} />

      <ProgressOverlay isLoading={isLoading}>
        <List sx={{ overflowX: "auto" }}>
          {rows.map(token => (
            <StyledListItem key={token.id} wrap>
              <ListItemText sx={{ width: 0.2 }}>{token.round?.contract?.title}</ListItemText>
              <ListItemText sx={{ width: 0.2 }}>{token.id}</ListItemText>
              <ListItemText sx={{ width: 0.2 }}>
                {"Round #"}
                {token.round.roundId}
              </ListItemText>
              <ListItemText sx={{ width: 0.2 }}>{token.round.number === token.tokenId ? "winner" : ""}</ListItemText>
              <ListActions>
                <RaffleRewardButton token={token} />
                <ListAction onClick={handleView(token)} message="form.tips.view" icon={Visibility} />
              </ListActions>
            </StyledListItem>
          ))}
        </List>
      </ProgressOverlay>

      <StyledPagination
        shape="rounded"
        page={search.skip / search.take + 1}
        count={Math.ceil(count / search.take)}
        onChange={handleChangePage}
      />

      <RaffleTokenViewDialog
        onCancel={handleViewCancel}
        onConfirm={handleViewConfirm}
        open={isViewDialogOpen}
        initialValues={selected}
      />
    </Grid>
  );
};
