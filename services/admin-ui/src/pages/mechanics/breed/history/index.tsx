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
import type { IBreedHistory, IBreedHistorySearchDto } from "@framework/types";

import { BreedHistoryViewDialog } from "./view";
// import { getNumbers, getWinners } from "../utils";
import { BreedHistorySearchForm } from "./form";

export const BreedHistory: FC = () => {
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
  } = useCollection<IBreedHistory, IBreedHistorySearchDto>({
    baseUrl: "/breed/history",
    search: {
      childIds: [],
    },
    empty: {},
  });

  return (
    <Grid>
      <Breadcrumbs path={["dashboard", "breed", "breed.history"]} />

      <PageHeader message="pages.breed.history.title">
        <Button startIcon={<FilterList />} onClick={handleToggleFilters} data-testid="ToggleFilterButton">
          <FormattedMessage
            id={`form.buttons.${isFiltersOpen ? "hideFilters" : "showFilters"}`}
            data-testid="ToggleFiltersButton"
          />
        </Button>
      </PageHeader>

      <BreedHistorySearchForm onSubmit={handleSearch} initialValues={search} open={isFiltersOpen} />

      <ProgressOverlay isLoading={isLoading}>
        <List>
          {rows.map((history, i) => (
            <ListItem key={i}>
              <ListItemText>
                {history.matronId} - {history.sireId} - {history.childId}
              </ListItemText>
              {/* <ListItemText>{getWinners(ticket, ticket.round!)}</ListItemText> */}
              <ListItemSecondaryAction>
                <IconButton onClick={handleView(history)}>
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

      <BreedHistoryViewDialog
        onCancel={handleViewCancel}
        onConfirm={handleViewConfirm}
        open={isViewDialogOpen}
        initialValues={selected}
      />
    </Grid>
  );
};
