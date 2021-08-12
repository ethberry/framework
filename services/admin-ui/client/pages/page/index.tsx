import React, { ChangeEvent, FC, useContext, useEffect, useState } from "react";
import { useSnackbar } from "notistack";
import { FormattedMessage, useIntl } from "react-intl";
import { Button, Grid, IconButton, List, ListItem, ListItemSecondaryAction, ListItemText } from "@material-ui/core";
import { Add, Create, Delete } from "@material-ui/icons";
import { Pagination } from "@material-ui/lab";
import { useHistory, useLocation, useParams } from "react-router";
import { parse, stringify } from "qs";

import { ProgressOverlay } from "@gemunionstudio/material-ui-progress";
import { PageHeader } from "@gemunionstudio/material-ui-page-header";
import { DeleteDialog } from "@gemunionstudio/material-ui-dialog-delete";
import { ApiContext, ApiError } from "@gemunionstudio/provider-api";
import { IPaginationResult, ISearchDto } from "@gemunionstudio/types-collection";
import { IPage, PageStatus } from "@gemunionstudio/framework-types";
import { emptyPage } from "@gemunionstudio/framework-mocks";

import { EditPageDialog } from "./edit";
import { Breadcrumbs } from "../../components/common/breadcrumbs";

export interface IPageSearchDto extends ISearchDto {
  categoryIds: Array<number>;
  pageStatus: Array<PageStatus>;
}

export const Page: FC = () => {
  const location = useLocation();
  const history = useHistory();
  const { enqueueSnackbar } = useSnackbar();
  const { formatMessage } = useIntl();

  const { id } = useParams<{ id?: string }>();
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [pages, setPages] = useState<Array<IPage>>([]);
  const [count, setCount] = useState<number>(0);
  const [selectedPage, setSelectedPage] = useState<IPage>(emptyPage);

  const api = useContext(ApiContext);

  const parsedData = parse(location.search.substring(1));

  const [data, setData] = useState<IPageSearchDto>({
    skip: 0,
    take: 10,
    query: "",
    pageStatus: [PageStatus.ACTIVE],
    categoryIds: [],
    ...parsedData,
  });

  const updateQS = (id?: number) => {
    const { skip: _skip, take: _take, ...rest } = data;
    history.push(id ? `/pages/${id}` : `/pages?${stringify(rest)}`);
  };

  const handleEdit = (page: IPage): (() => void) => {
    return (): void => {
      setSelectedPage(page);
      setIsEditDialogOpen(true);
      updateQS(page.id);
    };
  };

  const handleDelete = (page: IPage): (() => void) => {
    return (): void => {
      setSelectedPage(page);
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

  const fetchPagesByQuery = async (): Promise<void> => {
    return api
      .fetchJson({
        url: "/pages",
        data,
      })
      .then((json: IPaginationResult<IPage>) => {
        setPages(json.rows);
        setCount(json.count);
        updateQS();
      });
  };

  const fetchPagesById = async (id: string): Promise<void> => {
    return api
      .fetchJson({
        url: `/pages/${id}`,
      })
      .then((json: IPage) => {
        setPages([json]);
        setCount(1);
        handleEdit(json)();
      });
  };

  const fetchPages = async (id?: string): Promise<void> => {
    setIsLoading(true);
    return (id ? fetchPagesById(id) : fetchPagesByQuery())
      .catch(e => {
        console.error(e);
        enqueueSnackbar(formatMessage({ id: "snackbar.error" }), { variant: "error" });
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const handleAdd = (): void => {
    setSelectedPage(emptyPage);
    setIsEditDialogOpen(true);
  };

  const handleDeleteConfirmed = (page: IPage): Promise<void> => {
    return api
      .fetchJson({
        url: `/pages/${page.id}`,
        method: "DELETE",
      })
      .then(() => {
        enqueueSnackbar(formatMessage({ id: "snackbar.deleted" }), { variant: "success" });
        return fetchPages();
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

  const handleEditConfirmed = (values: Partial<IPage>, formikBag: any): Promise<void> => {
    const { id, ...data } = values;
    return api
      .fetchJson({
        url: id ? `/pages/${id}` : "/pages/",
        method: id ? "PUT" : "POST",
        data,
      })
      .then(() => {
        enqueueSnackbar(formatMessage({ id: id ? "snackbar.updated" : "snackbar.created" }), { variant: "success" });
        setIsEditDialogOpen(false);
        return fetchPages();
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

  useEffect(() => {
    void fetchPages(id);
  }, [data]);

  return (
    <Grid>
      <Breadcrumbs path={["dashboard", "pages"]} />

      <PageHeader message="pages.pages.title">
        <Button variant="outlined" startIcon={<Add />} onClick={handleAdd}>
          <FormattedMessage id="form.buttons.add" />
        </Button>
      </PageHeader>

      <ProgressOverlay isLoading={isLoading}>
        <List>
          {pages.map((page, i) => (
            <ListItem key={i}>
              <ListItemText>{page.title}</ListItemText>
              <ListItemSecondaryAction>
                <IconButton onClick={handleEdit(page)}>
                  <Create />
                </IconButton>
                <IconButton onClick={handleDelete(page)}>
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
        initialValues={selectedPage}
      />

      <EditPageDialog
        onCancel={handleEditCancel}
        onConfirm={handleEditConfirmed}
        open={isEditDialogOpen}
        initialValues={selectedPage}
      />
    </Grid>
  );
};
