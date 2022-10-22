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
  Typography,
} from "@mui/material";
import { FilterList, Visibility } from "@mui/icons-material";
import { FormattedMessage } from "react-intl";

import { Breadcrumbs, PageHeader, ProgressOverlay } from "@gemunion/mui-page-layout";
import { useCollection } from "@gemunion/react-hooks";
import type { IBreedHistory, IBreedHistorySearchDto } from "@framework/types";

import { BreedHistoryViewDialog } from "./view";
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
                <Typography variant="h6">
                  {history.matron && history.matron.token && history.matron.token.template
                    ? `${history.matron.token.template.title} #${history.matron.token.tokenId}`
                    : ""}{" "}
                  X{" "}
                  {history.sire && history.sire.token && history.sire.token.template
                    ? `${history.sire.token.template.title} #${history.sire.token.tokenId}`
                    : ""}{" "}
                  ={" "}
                  {history.child && history.child.token && history.child.token.template
                    ? `${history.child.token.template.title} #${history.child.token.tokenId}`
                    : "not yet born"}
                </Typography>
                <Typography variant="body1" color="textSecondary">
                  {history.matronId} - {history.sireId} - {history.childId || "?"}
                </Typography>
              </ListItemText>
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
