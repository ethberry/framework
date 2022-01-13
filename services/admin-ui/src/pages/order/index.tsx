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
import { Add, Create, Delete } from "@mui/icons-material";
import { useNavigate, useLocation, useParams } from "react-router";
import { parse, stringify } from "qs";
import useDeepCompareEffect from "use-deep-compare-effect";

import { DeleteDialog } from "@gemunion/mui-dialog-delete";
import { ProgressOverlay } from "@gemunion/mui-progress";
import { PageHeader } from "@gemunion/mui-page-header";
import { ApiContext, ApiError } from "@gemunion/provider-api";
import { IPaginationResult, IPaginationDto } from "@gemunion/types-collection";
import { IOrder, OrderStatus } from "@gemunion/framework-types";
import { defaultItemsPerPage } from "@gemunion/constants";
import { Breadcrumbs } from "@gemunion/mui-breadcrumbs";

import { EditOrderDialog } from "./edit";
import { parseDateRange, stringifyDateRange } from "./utils";
import { OrderSearchForm } from "./form";

export interface IOrderSearchDto extends IPaginationDto {
  orderStatus: Array<OrderStatus>;
  dateRange: [Date, Date];
  merchantId?: number;
}

export const emptyOrder = {
  userId: 3,
  merchantId: 1,
  productId: 1,
  price: 0,
  createdAt: new Date().toISOString(),
} as unknown as IOrder;

export const Order: FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [orders, setOrders] = useState<Array<IOrder>>([]);
  const [count, setCount] = useState<number>(0);
  const [selectedOrder, setSelectedOrder] = useState<IOrder>(emptyOrder);
  const { enqueueSnackbar } = useSnackbar();
  const { formatMessage } = useIntl();

  const api = useContext(ApiContext);

  const parsedData = parse(location.search.substring(1));

  const [data, setData] = useState<IOrderSearchDto>({
    skip: 0,
    take: defaultItemsPerPage,
    orderStatus: [OrderStatus.NEW],
    ...parsedData,
    dateRange: parseDateRange(parsedData.dateRange as string),
  });

  const updateQS = (id?: number) => {
    const { skip: _skip, take: _take, dateRange, ...rest } = data;
    navigate(
      id
        ? `/orders/${id}`
        : `/orders?${stringify({
            ...rest,
            dateRange: stringifyDateRange(dateRange),
          })}`,
    );
  };

  const handleEdit = (order: IOrder): (() => void) => {
    return (): void => {
      setSelectedOrder(order);
      setIsEditDialogOpen(true);
      updateQS(order.id);
    };
  };

  const handleDelete = (order: IOrder): (() => void) => {
    return (): void => {
      setSelectedOrder(order);
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

  const fetchOrdersByQuery = async (): Promise<void> => {
    const { dateRange, ...rest } = data;
    return api
      .fetchJson({
        url: "/orders",
        data: {
          ...rest,
          dateRange: stringifyDateRange(dateRange),
        },
      })
      .then((json: IPaginationResult<IOrder>) => {
        setOrders(json.rows);
        setCount(json.count);
        updateQS();
      });
  };

  const fetchOrdersById = async (id: string): Promise<void> => {
    return api
      .fetchJson({
        url: `/orders/${id}`,
      })
      .then((json: IOrder) => {
        setOrders([json]);
        setCount(1);
        handleEdit(json)();
      });
  };

  const fetchOrders = async (id?: string): Promise<void> => {
    setIsLoading(true);
    return (id ? fetchOrdersById(id) : fetchOrdersByQuery())
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
    setSelectedOrder(emptyOrder);
    setIsEditDialogOpen(true);
  };

  const handleDeleteConfirmed = (item: IOrder): Promise<void> => {
    return api
      .fetchJson({
        url: `/orders/${item.id}`,
        method: "DELETE",
      })
      .then(() => {
        enqueueSnackbar(formatMessage({ id: "snackbar.deleted" }), { variant: "success" });
        return fetchOrders();
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

  const handleEditConfirmed = (values: Partial<IOrder>, formikBag: any): Promise<void> => {
    const { id, ...data } = values;
    return api
      .fetchJson({
        url: id ? `/orders/${id}` : "/orders/",
        method: id ? "PUT" : "POST",
        data,
      })
      .then(() => {
        enqueueSnackbar(formatMessage({ id: id ? "snackbar.updated" : "snackbar.created" }), { variant: "success" });
        setIsEditDialogOpen(false);
        return fetchOrders();
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

  const handleSubmit = (values: IOrderSearchDto): void => {
    setData({
      ...values,
      skip: 0,
      take: defaultItemsPerPage,
    });
  };

  useDeepCompareEffect(() => {
    void fetchOrders(id);
  }, [data]);

  return (
    <Grid>
      <Breadcrumbs path={["dashboard", "orders"]} />

      <PageHeader message="pages.orders.title">
        <Button variant="outlined" startIcon={<Add />} onClick={handleAdd}>
          <FormattedMessage id="form.buttons.add" />
        </Button>
      </PageHeader>

      <OrderSearchForm onSubmit={handleSubmit} initialValues={data} />

      <ProgressOverlay isLoading={isLoading}>
        <List disablePadding={true}>
          {orders.map((order, i) => (
            <ListItem key={i} disableGutters={true}>
              <ListItemText>Order #{order.id}</ListItemText>
              <ListItemSecondaryAction>
                <IconButton onClick={handleEdit(order)}>
                  <Create />
                </IconButton>
                <IconButton onClick={handleDelete(order)}>
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
        initialValues={selectedOrder}
        getTitle={(order: IOrder) => `Order #${order.id}`}
      />

      <EditOrderDialog
        onCancel={handleEditCancel}
        onConfirm={handleEditConfirmed}
        open={isEditDialogOpen}
        initialValues={selectedOrder}
      />
    </Grid>
  );
};
