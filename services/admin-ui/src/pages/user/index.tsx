import React, { ChangeEvent, FC, useContext, useState } from "react";
import { useSnackbar } from "notistack";
import { FormattedMessage, useIntl } from "react-intl";
import { Button, Grid, IconButton, List, ListItem, ListItemSecondaryAction, ListItemText } from "@mui/material";
import { Create, Delete, FilterList } from "@mui/icons-material";
import { Pagination } from "@mui/lab";
import { useNavigate, useLocation, useParams } from "react-router";
import { parse, stringify } from "qs";
import useDeepCompareEffect from "use-deep-compare-effect";

import { ProgressOverlay } from "@gemunion/mui-progress";
import { PageHeader } from "@gemunion/mui-page-header";
import { DeleteDialog } from "@gemunion/mui-dialog-delete";
import { ApiContext, ApiError } from "@gemunion/provider-api";
import { IUser, IUserSearchDto, UserStatus } from "@gemunion/framework-types";
import { IPaginationResult } from "@gemunion/types-collection";
import { emptyUser } from "@gemunion/framework-mocks";
import { defaultItemsPerPage } from "@gemunion/constants";

import { EditUserDialog } from "./edit";
import { UserSearchForm } from "./form";
import { Breadcrumbs } from "../../components/common/breadcrumbs";

export const User: FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const { formatMessage } = useIntl();
  const { id } = useParams<"id">();
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [users, setUsers] = useState<Array<IUser>>([]);
  const [count, setCount] = useState<number>(0);
  const [selectedUser, setSelectedUser] = useState<IUser>(emptyUser);
  const [isFiltersOpen, setIsFilterOpen] = useState(false);

  const api = useContext(ApiContext);

  const [data, setData] = useState<IUserSearchDto>({
    skip: 0,
    take: defaultItemsPerPage,
    query: "",
    userStatus: [UserStatus.ACTIVE],
    userRoles: [],
    ...parse(location.search.substring(1)),
  });

  const updateQS = (id?: number) => {
    const { skip: _skip, take: _take, ...rest } = data;
    navigate(id ? `/users/${id}` : `/users?${stringify(rest)}`);
  };

  const handleEdit = (user: IUser): (() => void) => {
    return (): void => {
      setSelectedUser(user);
      setIsEditDialogOpen(true);
      updateQS(user.id);
    };
  };

  const fetchUsersByQuery = async (): Promise<void> => {
    return api
      .fetchJson({
        url: "/users",
        data,
      })
      .then((json: IPaginationResult<IUser>) => {
        setUsers(json.rows);
        setCount(json.count);
        updateQS();
      });
  };

  const fetchUsersById = async (id: string): Promise<void> => {
    return api
      .fetchJson({
        url: `/users/${id}`,
      })
      .then((json: IUser) => {
        setUsers([json]);
        setCount(1);
        handleEdit(json)();
      });
  };

  const fetchUsers = async (id?: string): Promise<void> => {
    setIsLoading(true);
    return (id ? fetchUsersById(id) : fetchUsersByQuery())
      .catch((e: ApiError) => {
        if (e.status) {
          enqueueSnackbar(formatMessage({ id: `snackbar.${e.message}` }), { variant: "error" });
        } else {
          console.error(e);
          enqueueSnackbar(formatMessage({ id: "snackbar.error" }), { variant: "error" });
        }
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const handleDelete = (user: IUser): (() => void) => {
    return (): void => {
      setSelectedUser(user);
      setIsDeleteDialogOpen(true);
    };
  };

  const handleDeleteCancel = (): void => {
    setIsDeleteDialogOpen(false);
  };

  const handleEditCancel = (): void => {
    setIsEditDialogOpen(false);
    updateQS();
  };

  const handleDeleteConfirmed = (user: IUser): Promise<void> => {
    return api
      .fetchJson({
        url: `/users/${user.id}`,
        method: "DELETE",
      })
      .then(() => {
        enqueueSnackbar(formatMessage({ id: "snackbar.deleted" }), { variant: "success" });
        return fetchUsers();
      })
      .catch((e: ApiError) => {
        if (e.status) {
          enqueueSnackbar(formatMessage({ id: `snackbar.${e.message}` }), { variant: "error" });
        } else {
          console.error(e);
          enqueueSnackbar(formatMessage({ id: "snackbar.error" }), { variant: "error" });
        }
      })
      .finally(() => {
        setIsDeleteDialogOpen(false);
      });
  };

  const handleEditConfirmed = (values: Partial<IUser>, formikBag: any): Promise<void> => {
    const { id, ...data } = values;
    return api
      .fetchJson({
        url: id ? `/users/${id}` : "/users",
        method: id ? "PUT" : "POST",
        data: { id, ...data },
      })
      .then(() => {
        enqueueSnackbar(formatMessage({ id: id ? "snackbar.updated" : "snackbar.created" }), { variant: "success" });
        setIsEditDialogOpen(false);
        return fetchUsers();
      })
      .catch((e: ApiError) => {
        if (e.status === 400) {
          formikBag.setErrors(e.getLocalizedValidationErrors());
        } else if (e.status) {
          enqueueSnackbar(formatMessage({ id: `snackbar.${e.message}` }), { variant: "error" });
        } else {
          console.error(e);
          enqueueSnackbar(formatMessage({ id: "snackbar.error" }), { variant: "error" });
        }
      });
  };

  const handleChangePage = (e: ChangeEvent<unknown>, page: number) => {
    setData({
      ...data,
      skip: (page - 1) * data.take,
    });
  };

  const handleSubmit = (values: IUserSearchDto): void => {
    setData({
      ...values,
      skip: 0,
      take: defaultItemsPerPage,
    });
  };

  const toggleFilters = () => {
    setIsFilterOpen(!isFiltersOpen);
  };

  useDeepCompareEffect(() => {
    void fetchUsers(id);
  }, [data]);

  return (
    <Grid>
      <Breadcrumbs path={["dashboard", "users"]} />

      <PageHeader message="pages.users.title">
        <Button startIcon={<FilterList />} onClick={toggleFilters}>
          <FormattedMessage id={`form.buttons.${isFiltersOpen ? "hideFilters" : "showFilters"}`} />
        </Button>
      </PageHeader>

      <UserSearchForm onSubmit={handleSubmit} initialValues={data} open={isFiltersOpen} />

      <ProgressOverlay isLoading={isLoading}>
        <List>
          {users.map((user, i) => (
            <ListItem key={i}>
              <ListItemText>
                {user.firstName} {user.lastName}
              </ListItemText>
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
        shape="rounded"
        page={data.skip / data.take + 1}
        count={Math.ceil(count / data.take)}
        onChange={handleChangePage}
      />

      <DeleteDialog
        onCancel={handleDeleteCancel}
        onConfirm={handleDeleteConfirmed}
        open={isDeleteDialogOpen}
        initialValues={selectedUser}
        getTitle={(user: IUser) => `${user.firstName} ${user.lastName}`}
      />

      <EditUserDialog
        onCancel={handleEditCancel}
        onConfirm={handleEditConfirmed}
        open={isEditDialogOpen}
        initialValues={selectedUser}
      />
    </Grid>
  );
};
