import React, { ChangeEvent, FC, useContext, useEffect, useState } from "react";
import { useSnackbar } from "notistack";
import { FormattedMessage, useIntl } from "react-intl";
import { Button, Grid, IconButton, List, ListItem, ListItemSecondaryAction, ListItemText } from "@material-ui/core";
import { Add, Create, Delete, FilterList } from "@material-ui/icons";
import { Pagination } from "@material-ui/lab";
import { useHistory, useLocation, useParams } from "react-router";
import { parse, stringify } from "qs";

import { ProgressOverlay } from "@gemunionstudio/material-ui-progress";
import { PageHeader } from "@gemunionstudio/material-ui-page-header";
import { DeleteDialog } from "@gemunionstudio/material-ui-dialog-delete";
import { ApiContext, ApiError } from "@gemunionstudio/provider-api";
import { IPaginationResult, ISearchDto } from "@gemunionstudio/types-collection";
import { IMerchant, MerchantStatus } from "@gemunionstudio/framework-types";
import { emptyMerchant } from "@gemunionstudio/framework-mocks";

import { Breadcrumbs } from "../../components/common/breadcrumbs";
import { EditMerchantDialog } from "./edit";
import { MerchantSearchForm } from "./form";

export interface IMerchantSearchDto extends ISearchDto {
  merchantStatus: Array<MerchantStatus>;
}

export const Merchant: FC = () => {
  const location = useLocation();
  const history = useHistory();
  const { enqueueSnackbar } = useSnackbar();
  const { formatMessage } = useIntl();

  const { id } = useParams<{ id?: string }>();
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [merchants, setMerchants] = useState<Array<IMerchant>>([]);
  const [count, setCount] = useState<number>(0);
  const [selectedMerchant, setSelectedMerchant] = useState<IMerchant>(emptyMerchant);
  const [isFiltersOpen, setIsFilterOpen] = useState(false);

  const api = useContext(ApiContext);

  const [data, setData] = useState<IMerchantSearchDto>({
    skip: 0,
    take: 10,
    query: "",
    merchantStatus: [MerchantStatus.ACTIVE],
    ...parse(location.search.substring(1)),
  });

  const updateQS = (id?: number) => {
    const { skip: _skip, take: _take, ...rest } = data;
    history.push(id ? `/merchants/${id}` : `/merchants?${stringify(rest)}`);
  };

  const handleEdit = (merchant: IMerchant): (() => void) => {
    return (): void => {
      setSelectedMerchant(merchant);
      setIsEditDialogOpen(true);
      updateQS(merchant.id);
    };
  };

  const handleDelete = (merchant: IMerchant): (() => void) => {
    return (): void => {
      setSelectedMerchant(merchant);
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

  const fetchMerchantsByQuery = async (): Promise<void> => {
    return api
      .fetchJson({
        url: "/merchants",
        data,
      })
      .then((json: IPaginationResult<IMerchant>) => {
        setMerchants(json.rows);
        setCount(json.count);
        updateQS();
      });
  };

  const fetchMerchantsById = async (id: string): Promise<void> => {
    return api
      .fetchJson({
        url: `/merchants/${id}`,
      })
      .then((json: IMerchant) => {
        setMerchants([json]);
        setCount(1);
        handleEdit(json)();
      });
  };

  const fetchMerchants = async (id?: string): Promise<void> => {
    setIsLoading(true);
    return (id ? fetchMerchantsById(id) : fetchMerchantsByQuery())
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

  const handleAdd = (): void => {
    setSelectedMerchant(emptyMerchant);
    setIsEditDialogOpen(true);
  };

  const handleDeleteConfirmed = (merchant: IMerchant): Promise<void> => {
    return api
      .fetchJson({
        url: `/merchants/${merchant.id}`,
        method: "DELETE",
      })
      .then(() => {
        enqueueSnackbar(formatMessage({ id: "snackbar.deleted" }), { variant: "success" });
        return fetchMerchants();
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

  const handleEditConfirmed = (values: Partial<IMerchant>, formikBag: any): Promise<void> => {
    const { id, ...data } = values;
    return api
      .fetchJson({
        url: id ? `/merchants/${id}` : "/merchants/",
        method: id ? "PUT" : "POST",
        data,
      })
      .then(() => {
        enqueueSnackbar(formatMessage({ id: id ? "snackbar.updated" : "snackbar.created" }), { variant: "success" });
        setIsEditDialogOpen(false);
        return fetchMerchants();
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

  const handleSubmit = (values: IMerchantSearchDto): void => {
    setData({
      ...values,
      skip: 0,
      take: 10,
    });
  };

  const toggleFilters = () => {
    setIsFilterOpen(!isFiltersOpen);
  };

  useEffect(() => {
    void fetchMerchants(id);
  }, [data]);

  return (
    <Grid>
      <Breadcrumbs path={["dashboard", "merchants"]} />

      <PageHeader message="pages.merchants.title">
        <Button startIcon={<FilterList />} onClick={toggleFilters}>
          <FormattedMessage id={`form.buttons.${isFiltersOpen ? "hideFilters" : "showFilters"}`} />
        </Button>
        <Button variant="outlined" startIcon={<Add />} onClick={handleAdd}>
          <FormattedMessage id="form.buttons.add" />
        </Button>
      </PageHeader>

      <MerchantSearchForm onSubmit={handleSubmit} initialValues={data} open={isFiltersOpen} />

      <ProgressOverlay isLoading={isLoading}>
        <List>
          {merchants.map((merchant, i) => (
            <ListItem key={i}>
              <ListItemText>{merchant.title}</ListItemText>
              <ListItemSecondaryAction>
                <IconButton onClick={handleEdit(merchant)}>
                  <Create />
                </IconButton>
                <IconButton onClick={handleDelete(merchant)}>
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
        initialValues={selectedMerchant}
      />

      <EditMerchantDialog
        onCancel={handleEditCancel}
        onConfirm={handleEditConfirmed}
        open={isEditDialogOpen}
        initialValues={selectedMerchant}
      />
    </Grid>
  );
};
