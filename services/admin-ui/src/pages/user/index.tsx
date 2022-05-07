import { FC } from "react";
import { FormattedMessage } from "react-intl";
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
import { Create, Delete, FilterList } from "@mui/icons-material";

import { Breadcrumbs, PageHeader, ProgressOverlay } from "@gemunion/mui-page-layout";
import { DeleteDialog } from "@gemunion/mui-dialog-delete";
import { IUser, IUserSearchDto, UserStatus } from "@framework/types";
import { EnabledLanguages } from "@framework/constants";
import { useCollection } from "@gemunion/react-hooks";

import { UserEditDialog } from "./edit";
import { UserSearchForm } from "./form";

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
    handleSubmit,
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
        <Button startIcon={<FilterList />} onClick={handleToggleFilters}>
          <FormattedMessage
            id={`form.buttons.${isFiltersOpen ? "hideFilters" : "showFilters"}`}
            data-testid="ToggleFiltersButton"
          />
        </Button>
      </PageHeader>

      <UserSearchForm onSubmit={handleSubmit} initialValues={search} open={isFiltersOpen} />

      <ProgressOverlay isLoading={isLoading}>
        <List>
          {rows.map((user, i) => (
            <ListItem key={i}>
              <ListItemText>{user.displayName}</ListItemText>
              <ListItemSecondaryAction>
                <IconButton onClick={handleEdit(user)}>
                  <Create />
                </IconButton>
                <IconButton onClick={handleDelete(user)}>
                  <Delete />
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
