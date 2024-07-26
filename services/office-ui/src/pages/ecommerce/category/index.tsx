import { FC } from "react";
import { FormattedMessage } from "react-intl";
import { Button, Grid, ListItemText } from "@mui/material";
import { Add, Create, Delete } from "@mui/icons-material";

import { ListAction, ListActions, StyledListItem, StyledListWrapper, StyledPagination } from "@framework/styled";
import type { ICategory } from "@framework/types";
import { DeleteDialog } from "@gemunion/mui-dialog-delete";
import { CommonSearchForm } from "@gemunion/mui-form-search";
import { Breadcrumbs, PageHeader, ProgressOverlay } from "@gemunion/mui-page-layout";
import { useCollection, CollectionActions } from "@gemunion/provider-collection";

import { emptyCategory } from "../../../components/common/interfaces";
import { EditCategoryDialog } from "./edit";

export const Category: FC = () => {
  const {
    rows,
    count,
    search,
    action,
    selected,
    isLoading,
    handleCreate,
    handleEdit,
    handleEditCancel,
    handleEditConfirm,
    handleDelete,
    handleDeleteCancel,
    handleSearch,
    handleChangePage,
    handleDeleteConfirm,
  } = useCollection<ICategory>({
    baseUrl: "/categories",
    empty: emptyCategory,
  });

  return (
    <Grid>
      <Breadcrumbs path={["dashboard", "category"]} />

      <PageHeader message="pages.category.title">
        <Button
          variant="outlined"
          startIcon={<Add />}
          onClick={handleCreate}
          data-testid="EcommerceCategoryCreateButton"
        >
          <FormattedMessage id="form.buttons.create" />
        </Button>
      </PageHeader>

      <CommonSearchForm onSubmit={handleSearch} initialValues={search} />

      <ProgressOverlay isLoading={isLoading}>
        <StyledListWrapper count={rows.length} isLoading={isLoading}>
          {rows.map(category => (
            <StyledListItem key={category.id}>
              <ListItemText>{category.title}</ListItemText>
              <ListActions>
                <ListAction
                  onClick={handleEdit(category)}
                  message="form.buttons.edit"
                  dataTestId="CategoryEditButton"
                  icon={Create}
                />
                <ListAction
                  onClick={handleDelete(category)}
                  message="form.buttons.delete"
                  dataTestId="CategoryDeleteButton"
                  icon={Delete}
                />
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

      <DeleteDialog
        onCancel={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        open={action === CollectionActions.delete}
        initialValues={selected}
      />

      <EditCategoryDialog
        onCancel={handleEditCancel}
        onConfirm={handleEditConfirm}
        open={action === CollectionActions.edit}
        initialValues={selected}
      />
    </Grid>
  );
};
