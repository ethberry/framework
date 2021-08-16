import React, { ChangeEvent, FC, useContext, useEffect, useState } from "react";
import { useSnackbar } from "notistack";
import { FormattedMessage, useIntl } from "react-intl";
import { Button, Grid, IconButton, List, ListItem, ListItemSecondaryAction, ListItemText } from "@material-ui/core";
import { Add, Create, Delete } from "@material-ui/icons";
import { Pagination } from "@material-ui/lab";
import { useHistory, useLocation, useParams } from "react-router";
import { parse, stringify } from "qs";

import { ProgressOverlay } from "@gemunion/material-ui-progress";
import { PageHeader } from "@gemunion/material-ui-page-header";
import { DeleteDialog } from "@gemunion/material-ui-dialog-delete";
import { CommonSearchForm } from "@gemunion/material-ui-form-search";
import { ApiContext, ApiError } from "@gemunion/provider-api";
import { IPaginationResult, ISearchDto } from "@gemunion/types-collection";
import { ICategory } from "@gemunion/framework-types";
import { emptyCategory } from "@gemunion/framework-mocks";

import { EditCategoryDialog } from "./edit";
import { Breadcrumbs } from "../../components/common/breadcrumbs";

export const Category: FC = () => {
  const location = useLocation();
  const history = useHistory();
  const { enqueueSnackbar } = useSnackbar();
  const { formatMessage } = useIntl();

  const { id } = useParams<{ id?: string }>();
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [categories, setCategories] = useState<Array<ICategory>>([]);
  const [count, setCount] = useState<number>(0);
  const [selectedCategory, setSelectedCategory] = useState<ICategory>(emptyCategory);

  const api = useContext(ApiContext);

  const [data, setData] = useState<ISearchDto>({
    skip: 0,
    take: 10,
    query: "",
    ...parse(location.search.substring(1)),
  });

  const updateQS = (id?: number) => {
    const { skip: _skip, take: _take, ...rest } = data;
    history.push(id ? `/categories/${id}` : `/categories?${stringify(rest)}`);
  };

  const handleEdit = (category: ICategory): (() => void) => {
    return (): void => {
      setSelectedCategory(category);
      setIsEditDialogOpen(true);
      updateQS(category.id);
    };
  };

  const handleDelete = (category: ICategory): (() => void) => {
    return (): void => {
      setSelectedCategory(category);
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

  const fetchCategoriesByQuery = async (): Promise<void> => {
    return api
      .fetchJson({
        url: "/categories",
        data,
      })
      .then((json: IPaginationResult<ICategory>) => {
        setCategories(json.rows);
        setCount(json.count);
        updateQS();
      });
  };

  const fetchCategoriesById = async (id: string): Promise<void> => {
    return api
      .fetchJson({
        url: `/categories/${id}`,
      })
      .then((json: ICategory) => {
        setCategories([json]);
        setCount(1);
        handleEdit(json)();
      });
  };

  const fetchCategories = async (id?: string): Promise<void> => {
    setIsLoading(true);
    return (id ? fetchCategoriesById(id) : fetchCategoriesByQuery())
      .catch(e => {
        console.error(e);
        enqueueSnackbar(formatMessage({ id: "snackbar.error" }), { variant: "error" });
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const handleAdd = (): void => {
    setSelectedCategory(emptyCategory);
    setIsEditDialogOpen(true);
  };

  const handleDeleteConfirmed = (category: ICategory): Promise<void> => {
    return api
      .fetchJson({
        url: `/categories/${category.id}`,
        method: "DELETE",
      })
      .then(() => {
        enqueueSnackbar(formatMessage({ id: "snackbar.deleted" }), { variant: "success" });
        return fetchCategories();
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

  const handleEditConfirmed = (values: Partial<ICategory>, formikBag: any): Promise<void> => {
    const { id, ...data } = values;
    return api
      .fetchJson({
        url: id ? `/categories/${id}` : "/categories/",
        method: id ? "PUT" : "POST",
        data,
      })
      .then(() => {
        enqueueSnackbar(formatMessage({ id: id ? "snackbar.updated" : "snackbar.created" }), { variant: "success" });
        setIsEditDialogOpen(false);
        return fetchCategories();
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

  const handleSubmit = (values: ISearchDto): void => {
    setData({
      ...values,
      skip: 0,
      take: 10,
    });
  };

  useEffect(() => {
    void fetchCategories(id);
  }, [data]);

  return (
    <Grid>
      <Breadcrumbs path={["dashboard", "category"]} />

      <PageHeader message="pages.category.title">
        <Button variant="outlined" startIcon={<Add />} onClick={handleAdd}>
          <FormattedMessage id="form.buttons.add" />
        </Button>
      </PageHeader>

      <CommonSearchForm onSubmit={handleSubmit} initialValues={data} />

      <ProgressOverlay isLoading={isLoading}>
        <List>
          {categories.map((category, i) => (
            <ListItem key={i}>
              <ListItemText>{category.title}</ListItemText>
              <ListItemSecondaryAction>
                <IconButton onClick={handleEdit(category)}>
                  <Create />
                </IconButton>
                <IconButton onClick={handleDelete(category)}>
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
        initialValues={selectedCategory}
      />

      <EditCategoryDialog
        onCancel={handleEditCancel}
        onConfirm={handleEditConfirmed}
        open={isEditDialogOpen}
        initialValues={selectedCategory}
      />
    </Grid>
  );
};
