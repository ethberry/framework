import { FC } from "react";
import { FormattedMessage } from "react-intl";
import { Button, Grid, List, ListItem, ListItemText, Pagination } from "@mui/material";
import { Create, Delete, FilterList } from "@mui/icons-material";

import { SelectInput } from "@gemunion/mui-inputs-core";
import { CommonSearchForm } from "@gemunion/mui-form-search";
import { Breadcrumbs, PageHeader, ProgressOverlay } from "@gemunion/mui-page-layout";
import { DeleteDialog } from "@gemunion/mui-dialog-delete";
import type { IUser, IUserSearchDto } from "@framework/types";
import { UserRole, UserStatus } from "@framework/types";
import { EnabledLanguages } from "@framework/constants";
import { useCollection } from "@gemunion/react-hooks";

import { ListAction, ListActions } from "../../../components/common/lists";
import { UserEditDialog } from "./edit";

export const User: FC = () => {
  const {
    rows,
    count,
    search,
    selected,
    isLoading,
    isFiltersOpen,
    isEditDialogOpen,
    isDeleteDialogOpen,
    handleToggleFilters,
    handleEdit,
    handleEditCancel,
    handleEditConfirm,
    handleDelete,
    handleDeleteCancel,
    handleSearch,
    handleChangePage,
    handleDeleteConfirm,
  } = useCollection<IUser, IUserSearchDto>({
    baseUrl: "/users",
    empty: {
      email: "",
      displayName: "",
      language: EnabledLanguages.EN,
      imageUrl: "",
      userStatus: UserStatus.ACTIVE,
      userRoles: [],
      createdAt: new Date().toISOString(),
    },
    search: {
      query: "",
      userStatus: [UserStatus.ACTIVE],
      userRoles: [],
    },
    filter: ({ id: _id, ...rest }) => rest,
  });

  return (
    <Grid>
      <Breadcrumbs path={["dashboard", "users"]} />

      <PageHeader message="pages.users.title">
        <Button startIcon={<FilterList />} onClick={handleToggleFilters} data-testid="ToggleFilterButton">
          <FormattedMessage
            id={`form.buttons.${isFiltersOpen ? "hideFilters" : "showFilters"}`}
            data-testid="ToggleFiltersButton"
          />
        </Button>
      </PageHeader>

      <CommonSearchForm onSubmit={handleSearch} initialValues={search} open={isFiltersOpen} testId="UserSearchForm">
        <Grid container spacing={2} alignItems="flex-end">
          <Grid item xs={6}>
            <SelectInput multiple name="userStatus" options={UserStatus} />
          </Grid>
          <Grid item xs={6}>
            <SelectInput multiple name="userRoles" options={UserRole} />
          </Grid>
        </Grid>
      </CommonSearchForm>

      <ProgressOverlay isLoading={isLoading}>
        <List>
          {rows.map(user => (
            <ListItem key={user.id}>
              <ListItemText>{user.displayName}</ListItemText>
              <ListActions>
                <ListAction onClick={handleEdit(user)} icon={Create} message="form.actions.edit" />
                <ListAction onClick={handleDelete(user)} icon={Delete} message="form.actions.delete" />
              </ListActions>
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

      <DeleteDialog
        onCancel={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        open={isDeleteDialogOpen}
        initialValues={selected}
        getTitle={(user: IUser) => user.displayName}
      />

      <UserEditDialog
        onCancel={handleEditCancel}
        onConfirm={handleEditConfirm}
        open={isEditDialogOpen}
        initialValues={selected}
      />
    </Grid>
  );
};
