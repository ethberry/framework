import { FC } from "react";
import { Button, Grid, ListItemText } from "@mui/material";
import { FilterList, Visibility } from "@mui/icons-material";
import { FormattedMessage } from "react-intl";

import { ListAction, ListActions, StyledListItem, StyledListWrapper, StyledPagination } from "@framework/styled";
import type { IRaffleRound, IRaffleToken, IRaffleTicketTokenSearchDto } from "@framework/types";
import { Breadcrumbs, PageHeader, ProgressOverlay } from "@gemunion/mui-page-layout";
import { useCollection, CollectionActions } from "@gemunion/react-hooks";

import { RaffleRewardButton } from "../../../../../components/buttons";
import { RaffleTokenSearchForm } from "./form";
import { RaffleTokenViewDialog } from "./view";

export const RaffleTicketTokenList: FC = () => {
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
  } = useCollection<IRaffleToken, IRaffleTicketTokenSearchDto>({
    baseUrl: "/raffle/ticket/tokens",
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
        <StyledListWrapper count={rows.length} isLoading={isLoading}>
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
        </StyledListWrapper>
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
        open={action === CollectionActions.view}
        initialValues={selected}
      />
    </Grid>
  );
};
