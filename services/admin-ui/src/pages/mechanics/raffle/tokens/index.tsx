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
import type { IRaffleTokenSearchDto, IRaffleToken, IRaffleRound } from "@framework/types";

import { RaffleTokenViewDialog } from "./view";
import { RaffleTokenSearchForm } from "./form";

export const RaffleTokens: FC = () => {
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
  } = useCollection<IRaffleToken, IRaffleTokenSearchDto>({
    baseUrl: "/raffle/tokens",
    search: {
      roundIds: [],
    },
    empty: {
      round: {
        number: "0",
      } as unknown as IRaffleRound,
    },
  });

  return (
    <Grid>
      <Breadcrumbs path={["dashboard", "raffle", "raffle.tokens"]} />

      <PageHeader message="pages.raffle.tokens.title">
        <Button startIcon={<FilterList />} onClick={handleToggleFilters} data-testid="ToggleFilterButton">
          <FormattedMessage
            id={`form.buttons.${isFiltersOpen ? "hideFilters" : "showFilters"}`}
            data-testid="ToggleFiltersButton"
          />
        </Button>
      </PageHeader>

      <RaffleTokenSearchForm onSubmit={handleSearch} initialValues={search} open={isFiltersOpen} />

      <ProgressOverlay isLoading={isLoading}>
        <List>
          {rows.map((token, i) => (
            <ListItem key={i}>
              <ListItemText sx={{ width: 0.2 }}>{token.id}</ListItemText>
              <ListItemText sx={{ width: 0.2 }}>{token.tokenId}</ListItemText>
              <ListItemText sx={{ width: 0.2 }}>
                {"Round #"}
                {token.round.roundId}
              </ListItemText>
              <ListItemText sx={{ width: 0.2 }}>{token.round.contract?.title}</ListItemText>
              <ListItemText sx={{ width: 0.2 }}>
                {token.metadata.PRIZE ? "Prize " : ""}
                {token.round.number === token.tokenId ? "winner" : ""}
              </ListItemText>

              <ListItemSecondaryAction>
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

      <RaffleTokenViewDialog
        onCancel={handleViewCancel}
        onConfirm={handleViewConfirm}
        open={isViewDialogOpen}
        initialValues={selected}
      />
    </Grid>
  );
};
