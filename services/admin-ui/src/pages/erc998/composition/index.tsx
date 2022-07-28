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
import { Add, FilterList, Visibility } from "@mui/icons-material";
import { FormattedMessage } from "react-intl";

import { Breadcrumbs, PageHeader, ProgressOverlay } from "@gemunion/mui-page-layout";
import { useCollection } from "@gemunion/react-hooks";
import { IComposition, ICompositionSearchDto } from "@framework/types";

import { Erc998CompositionViewDialog } from "./view";
import { Erc998CompositionSearchForm } from "./form";

export const Erc998Composition: FC = () => {
  const {
    rows,
    count,
    search,
    selected,
    isLoading,
    isFiltersOpen,
    isViewDialogOpen,
    handleToggleFilters,
    handleCreate,
    handleView,
    handleViewCancel,
    handleViewConfirm,
    handleSearch,
    handleChangePage,
  } = useCollection<IComposition, ICompositionSearchDto>({
    baseUrl: "/erc998-composition",
    empty: {
      amount: 0,
    },
    search: {
      parentIds: [],
      childIds: [],
    },
  });

  return (
    <Grid>
      <Breadcrumbs path={["dashboard", "erc998-composition"]} />

      <PageHeader message="pages.erc998-composition.title">
        <Button startIcon={<FilterList />} onClick={handleToggleFilters} data-testid="ToggleFilterButton">
          <FormattedMessage
            id={`form.buttons.${isFiltersOpen ? "hideFilters" : "showFilters"}`}
            data-testid="ToggleFiltersButton"
          />
        </Button>
        <Button
          variant="outlined"
          startIcon={<Add />}
          onClick={handleCreate}
          data-testid="Erc998CompositionCreateButton"
        >
          <FormattedMessage id="form.buttons.create" />
        </Button>
      </PageHeader>

      <Erc998CompositionSearchForm onSubmit={handleSearch} initialValues={search} open={isFiltersOpen} />

      <ProgressOverlay isLoading={isLoading}>
        <List>
          {rows.map((composition, i) => (
            <ListItem key={i}>
              <ListItemText>
                {composition.parent?.title} + {composition.child?.title}
              </ListItemText>
              <ListItemSecondaryAction>
                <IconButton onClick={handleView(composition)}>
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

      <Erc998CompositionViewDialog
        onCancel={handleViewCancel}
        onConfirm={handleViewConfirm}
        open={isViewDialogOpen}
        initialValues={selected}
      />
    </Grid>
  );
};
