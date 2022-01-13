import { ChangeEvent, FC, useContext, useState } from "react";
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
import { Add, Create, Delete, FilterList } from "@mui/icons-material";
import { useNavigate, useLocation, useParams } from "react-router";
import { parse, stringify } from "qs";
import useDeepCompareEffect from "use-deep-compare-effect";

import { ProgressOverlay } from "@gemunion/mui-progress";
import { PageHeader } from "@gemunion/mui-page-header";
import { DeleteDialog } from "@gemunion/mui-dialog-delete";
import { ApiContext, ApiError } from "@gemunion/provider-api";
import { IPaginationResult } from "@gemunion/types-collection";
import { IMerchant, IMerchantSearchDto, MerchantStatus } from "@gemunion/framework-types";
import { defaultItemsPerPage } from "@gemunion/constants";
import { Breadcrumbs } from "@gemunion/mui-breadcrumbs";

import { EditMerchantDialog } from "./edit";
import { MerchantSearchForm } from "./form";

export const emptyMerchant = {
  title: "",
  description: "",
  email: "",
  phoneNumber: "",
  users: [],
} as unknown as IMerchant;

export const Merchant: FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const { formatMessage } = useIntl();

  const { id } = useParams<{ id: string }>();
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
    take: defaultItemsPerPage,
    query: "",
    merchantStatus: [MerchantStatus.ACTIVE],
    ...parse(location.search.substring(1)),
  });

  const updateQS = (id?: number) => {
    const { skip: _skip, take: _take, ...rest } = data;
    navigate(id ? `/merchants/${id}` : `/merchants?${stringify(rest)}`);
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
      take: defaultItemsPerPage,
    });
  };

  const toggleFilters = () => {
    setIsFilterOpen(!isFiltersOpen);
  };

  useDeepCompareEffect(() => {
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
