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
import { IRaffleTokenSearchDto, IRaffleToken, IRaffleRound } from "@framework/types";
import { useCollection } from "@gemunion/react-hooks";

import { RaffleTokenSearchForm } from "./form";
import { RaffleTokenViewDialog } from "./view";
import { RaffleRewardButton } from "../../../../components/buttons";

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
    baseUrl: "/raffle/token",
    empty: {
      round: {
        number: "0",
      } as unknown as IRaffleRound,
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
        <List sx={{ overflowX: "scroll" }}>
          {rows.map((token, i) => (
            <ListItem key={i} sx={{ flexWrap: "wrap" }}>
              <ListItemText sx={{ width: 0.2 }}>{token.id}</ListItemText>
              <ListItemText sx={{ width: 0.3 }}>{token.metadata.NUMBER}</ListItemText>
              <ListItemText sx={{ width: 0.2 }}>
                {"Round #"}
                {token.round.roundId}
              </ListItemText>
              <ListItemText sx={{ width: { xs: 0.6, md: 0.2 } }}>
                {token.round.number === token.tokenId ? "winner" : ""}
              </ListItemText>
              <ListItemSecondaryAction>
                <RaffleRewardButton token={token} />
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
