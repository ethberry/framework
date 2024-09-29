import { FC } from "react";
import { FormattedMessage } from "react-intl";
import { Button, Grid, ListItemText } from "@mui/material";
import { Create, Delete, FilterList } from "@mui/icons-material";

import { SelectInput } from "@ethberry/mui-inputs-core";
import { CommonSearchForm } from "@ethberry/mui-form-search";
import { Breadcrumbs, PageHeader, ProgressOverlay } from "@ethberry/mui-page-layout";
import { useCollection, CollectionActions } from "@ethberry/provider-collection";
import { DeleteDialog } from "@ethberry/mui-dialog-delete";
import { EnabledLanguages } from "@framework/constants";
import { ListAction, ListActions, StyledListItem, StyledListWrapper, StyledPagination } from "@framework/styled";
import type { IUser, IUserSearchDto } from "@framework/types";
import { UserRole, UserStatus } from "@framework/types";

import { UserEditDialog } from "./edit";

export const User: FC = () => {
  const {
    rows,
    count,
    search,
    action,
    selected,
    isLoading,
    isFiltersOpen,
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
          <FormattedMessage id={`form.buttons.${isFiltersOpen ? "hideFilters" : "showFilters"}`} />
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
        <StyledListWrapper count={rows.length} isLoading={isLoading}>
          {rows.map(user => (
            <StyledListItem key={user.id}>
              <ListItemText>{user.displayName}</ListItemText>
              <ListActions>
                <ListAction
                  onClick={handleEdit(user)}
                  message="form.buttons.edit"
                  dataTestId="UserEditButton"
                  icon={Create}
                />
                <ListAction
                  onClick={handleDelete(user)}
                  message="form.buttons.delete"
                  dataTestId="UserDeleteButton"
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
        getTitle={(user: IUser) => user.displayName}
      />

      <UserEditDialog
        onCancel={handleEditCancel}
        onConfirm={handleEditConfirm}
        open={action === CollectionActions.edit}
        initialValues={selected}
      />
    </Grid>
  );
};
