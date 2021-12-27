import React, { ChangeEvent, FC, useContext, useState } from "react";
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
import { useNavigate, useLocation, useParams } from "react-router";
import { parse, stringify } from "qs";
import useDeepCompareEffect from "use-deep-compare-effect";

import { ApiContext, ApiError } from "@gemunion/provider-api";
import { ProgressOverlay } from "@gemunion/mui-progress";
import { PageHeader } from "@gemunion/mui-page-header";
import { DeleteDialog } from "@gemunion/mui-dialog-delete";
import { IPromo } from "@gemunion/framework-types";
import { emptyPromo } from "@gemunion/framework-mocks";
import { IPaginationResult, ISearchDto } from "@gemunion/types-collection";
import { CommonSearchForm } from "@gemunion/mui-form-search";
import { defaultItemsPerPage } from "@gemunion/constants";

import { EditPromoDialog } from "./edit";
import { Breadcrumbs } from "../../components/common/breadcrumbs";

export const Promo: FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const { formatMessage } = useIntl();

  const { id } = useParams<{ id: string }>();
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [promos, setPromos] = useState<Array<IPromo>>([]);
  const [count, setCount] = useState<number>(0);
  const [selectedPromo, setSelectedPromo] = useState<IPromo>(emptyPromo);

  const api = useContext(ApiContext);

  const [data, setData] = useState<ISearchDto>({
    skip: 0,
    take: defaultItemsPerPage,
    query: "",
    ...parse(location.search.substring(1)),
  });

  const updateQS = (id?: number) => {
    const { skip: _skip, take: _take, ...rest } = data;
    navigate(id ? `/promos/${id}` : `/promos?${stringify(rest)}`);
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
        setPromos(json.rows);
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
        enqueueSnackbar(formatMessage({ id: "snackbar.error" }), { variant: "error" });
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
        enqueueSnackbar(formatMessage({ id: "snackbar.deleted" }), { variant: "success" });
        return fetchPromos();
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

  const handleEditConfirmed = (values: Partial<IPromo>, formikBag: any): Promise<void> => {
    const { id, ...data } = values;
    return api
      .fetchJson({
        url: id ? `/promos/${id}` : "/promos/",
        method: id ? "PUT" : "POST",
        data,
      })
      .then(() => {
        enqueueSnackbar(formatMessage({ id: id ? "snackbar.updated" : "snackbar.created" }), { variant: "success" });
        setIsEditDialogOpen(false);
        return fetchPromos();
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
