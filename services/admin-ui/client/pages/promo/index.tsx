import React, {ChangeEvent, FC, useContext, useEffect, useState} from "react";
import {useSnackbar} from "notistack";
import {FormattedMessage, useIntl} from "react-intl";
import {Button, Grid, IconButton, List, ListItem, ListItemSecondaryAction, ListItemText} from "@material-ui/core";
import {Add, Create, Delete} from "@material-ui/icons";
import {Pagination} from "@material-ui/lab";
import {useHistory, useLocation, useParams} from "react-router";
import {parse, stringify} from "qs";

import {ApiContext, ApiError} from "@trejgun/provider-api";
import {ProgressOverlay} from "@trejgun/material-ui-progress";
import {PageHeader} from "@trejgun/material-ui-page-header";
import {DeleteDialog} from "@trejgun/material-ui-dialog-delete";
import {IPromo} from "@trejgun/solo-types";
import {emptyPromo} from "@trejgun/solo-mocks";
import {IPaginationResult, ISearchDto} from "@trejgun/types-collection";
import {CommonSearchForm} from "@trejgun/material-ui-form-search";

import {EditPromoDialog} from "./edit";
import {Breadcrumbs} from "../../components/common/breadcrumbs";

export const Promo: FC = () => {
  const location = useLocation();
  const history = useHistory();
  const {enqueueSnackbar} = useSnackbar();
  const {formatMessage} = useIntl();

  const {id} = useParams<{id?: string}>();
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [promos, setPromos] = useState<Array<IPromo>>([]);
  const [count, setCount] = useState<number>(0);
  const [selectedPromo, setSelectedPromo] = useState<IPromo>(emptyPromo);

  const api = useContext(ApiContext);

  const [data, setData] = useState<ISearchDto>({
    skip: 0,
    take: 10,
    query: "",
    ...parse(location.search.substring(1)),
  });

  const updateQS = (id?: number) => {
    const {skip: _skip, take: _take, ...rest} = data;
    history.push(id ? `/promos/${id}` : `/promos?${stringify(rest)}`);
  };

  const handleEdit = (promo: IPromo): (() => void) => {
    return (): void => {
      setSelectedPromo(promo);
      setIsEditDialogOpen(true);
      updateQS(promo.id);
    };
  };

  const handleDelete = (promo: IPromo): (() => void) => {
    return (): void => {
      setSelectedPromo(promo);
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

  const fetchPromosByQuery = async (): Promise<void> => {
    return api
      .fetchJson({
        url: "/promos",
        data,
      })
      .then((json: IPaginationResult<IPromo>) => {
        setPromos(json.list);
        setCount(json.count);
        updateQS();
      });
  };

  const fetchPromosById = async (id: string): Promise<void> => {
    return api
      .fetchJson({
        url: `/promos/${id}`,
      })
      .then((json: IPromo) => {
        setPromos([json]);
        setCount(1);
        handleEdit(json)();
      });
  };

  const fetchPromos = async (id?: string): Promise<void> => {
    setIsLoading(true);
    return (id ? fetchPromosById(id) : fetchPromosByQuery())
      .catch(e => {
        console.error(e);
        enqueueSnackbar(formatMessage({id: "snackbar.error"}), {variant: "error"});
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const handleAdd = (): void => {
    setSelectedPromo(emptyPromo);
    setIsEditDialogOpen(true);
  };

  const handleDeleteConfirmed = (promo: IPromo): Promise<void> => {
    return api
      .fetchJson({
        url: `/promos/${promo.id}`,
        method: "DELETE",
      })
      .then(() => {
        enqueueSnackbar(formatMessage({id: "snackbar.deleted"}), {variant: "success"});
        return fetchPromos();
      })
      .catch((e: ApiError) => {
        if (e.status) {
          enqueueSnackbar(formatMessage({id: `snackbar.${e.message}`}), {variant: "error"});
        } else {
          console.error(e);
          enqueueSnackbar(formatMessage({id: "snackbar.error"}), {variant: "error"});
        }
      })
      .finally(() => {
        setIsDeleteDialogOpen(false);
      });
  };

  const handleEditConfirmed = (values: Partial<IPromo>, formikBag: any): Promise<void> => {
    const {id, ...data} = values;
    return api
      .fetchJson({
        url: id ? `/promos/${id}` : "/promos/",
        method: id ? "PUT" : "POST",
        data,
      })
      .then(() => {
        enqueueSnackbar(formatMessage({id: id ? "snackbar.updated" : "snackbar.created"}), {variant: "success"});
        setIsEditDialogOpen(false);
        return fetchPromos();
      })
      .catch((e: ApiError) => {
        if (e.status === 400) {
          formikBag.setErrors(e.getLocalizedValidationErrors());
        } else if (e.status) {
          enqueueSnackbar(formatMessage({id: `snackbar.${e.message}`}), {variant: "error"});
        } else {
          console.error(e);
          enqueueSnackbar(formatMessage({id: "snackbar.error"}), {variant: "error"});
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
    void fetchPromos(id);
  }, [data]);

  return (
    <Grid>
      <Breadcrumbs path={["dashboard", "promos"]} />

      <PageHeader message="pages.promos.title">
        <Button variant="outlined" startIcon={<Add />} onClick={handleAdd}>
          <FormattedMessage id="form.buttons.add" />
        </Button>
      </PageHeader>

      <CommonSearchForm onSubmit={handleSubmit} initialValues={data} />

      <ProgressOverlay isLoading={isLoading}>
        <List disablePadding={true}>
          {promos.map((promo, i) => (
            <ListItem key={i}>
              <ListItemText>{promo.title}</ListItemText>
              <ListItemSecondaryAction>
                <IconButton onClick={handleEdit(promo)}>
                  <Create />
                </IconButton>
                <IconButton onClick={handleDelete(promo)}>
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
        initialValues={selectedPromo}
      />

      <EditPromoDialog
        onCancel={handleEditCancel}
        onConfirm={handleEditConfirmed}
        open={isEditDialogOpen}
        initialValues={selectedPromo}
      />
    </Grid>
  );
};
