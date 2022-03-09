import { ChangeEvent, FC, useState } from "react";
import { useSnackbar } from "notistack";
import { FormattedMessage, useIntl } from "react-intl";
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
import { Add, Create, Delete } from "@mui/icons-material";
import { useLocation, useNavigate, useParams } from "react-router";
import { parse, stringify } from "qs";
import useDeepCompareEffect from "use-deep-compare-effect";

import { ProgressOverlay } from "@gemunion/mui-progress";
import { PageHeader } from "@gemunion/mui-page-header";
import { DeleteDialog } from "@gemunion/mui-dialog-delete";
import { CommonSearchForm } from "@gemunion/mui-form-search";
import { ApiError, useApi } from "@gemunion/provider-api";
import { IPaginationResult, ISearchDto } from "@gemunion/types-collection";
import { ICategory } from "@gemunion/framework-types";
import { defaultItemsPerPage } from "@gemunion/constants";
import { Breadcrumbs } from "@gemunion/mui-breadcrumbs";

import { EditCategoryDialog } from "./edit";

export const emptyCategory = {
  title: "",
  description: "",
  parentId: 1,
} as unknown as ICategory;

export const Category: FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const { formatMessage } = useIntl();

  const { id } = useParams<{ id: string }>();
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [categories, setCategories] = useState<Array<ICategory>>([]);
  const [count, setCount] = useState<number>(0);
  const [selectedCategory, setSelectedCategory] = useState<ICategory>(emptyCategory);

  const api = useApi();

  const [data, setData] = useState<ISearchDto>({
    skip: 0,
    take: defaultItemsPerPage,
    query: "",
    ...parse(location.search.substring(1)),
  });

  const updateQS = (id?: number) => {
    const { skip: _skip, take: _take, ...rest } = data;
    navigate(id ? `/categories/${id}` : `/categories?${stringify(rest)}`);
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
      take: defaultItemsPerPage,
    });
  };

  useDeepCompareEffect(() => {
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
        sx={{ mt: 2 }}
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
