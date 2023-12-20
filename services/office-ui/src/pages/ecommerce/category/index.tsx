import { FC } from "react";
import { FormattedMessage } from "react-intl";
import { Button, Grid, List, ListItemText } from "@mui/material";
import { Add, Create, Delete } from "@mui/icons-material";

import { ListAction, ListActions, StyledListItem, StyledPagination } from "@framework/styled";
import type { ICategory } from "@framework/types";
import { DeleteDialog } from "@gemunion/mui-dialog-delete";
import { CommonSearchForm } from "@gemunion/mui-form-search";
import { Breadcrumbs, PageHeader, ProgressOverlay } from "@gemunion/mui-page-layout";
import { useCollection } from "@gemunion/react-hooks";

import { emptyCategory } from "../../../components/common/interfaces";
import { EditCategoryDialog } from "./edit";

export const Category: FC = () => {
  const {
    rows,
    count,
    search,
    selected,
    isLoading,
    isEditDialogOpen,
    isDeleteDialogOpen,
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
        <List>
          {rows.map(category => (
            <StyledListItem key={category.id}>
              <ListItemText>{category.title}</ListItemText>
              <ListActions>
                <ListAction onClick={handleEdit(category)} message="form.buttons.edit" icon={Create} />
                <ListAction onClick={handleDelete(category)} message="form.buttons.delete" icon={Delete} />
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

      <DeleteDialog
        onCancel={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        open={isDeleteDialogOpen}
        initialValues={selected}
      />

      <EditCategoryDialog
        onCancel={handleEditCancel}
        onConfirm={handleEditConfirm}
        open={isEditDialogOpen}
        initialValues={selected}
      />
    </Grid>
  );
};
