import { FC, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { useSnackbar } from "notistack";
import { useIntl } from "react-intl";
import { Grid } from "@mui/material";

import { IOrder, OrderStatus } from "@framework/types";
import { ApiContext, ApiError } from "@gemunion/provider-api-firebase";
import { IPaginationResult } from "@gemunion/types-collection";
import { Breadcrumbs, PageHeader } from "@gemunion/mui-page-layout";

import { EditOrderDialog } from "../order/edit";
import { groupOrdersByStatus } from "../order/utils";
import { Board } from "./board";
import { emptyOrder } from "../../../components/common/interfaces";

export const Kanban: FC = () => {
  const [orders, setOrders] = useState<Array<IOrder>>([]);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<IOrder>(emptyOrder);

  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const { formatMessage } = useIntl();

  const api = useContext(ApiContext);

  const fetchOrders = (): Promise<void> => {
    return api
      .fetchJson({
        url: "/orders",
        data: {
          orderStatus: [OrderStatus.NEW, OrderStatus.SCHEDULED, OrderStatus.NOW_IN_DELIVERY, OrderStatus.DELIVERED],
        },
      })
      .then((json: IPaginationResult<IOrder>) => {
        setOrders(json.rows);
      })
      .catch((e: ApiError) => {
        if (e.status) {
          enqueueSnackbar(formatMessage({ id: `snackbar.${e.message}` }), { variant: "error" });
        } else {
          console.error(e);
          enqueueSnackbar(formatMessage({ id: "snackbar.error" }), { variant: "error" });
        }
      });
  };

  const updateOrderStatus = (id: string, orderStatus: OrderStatus) => {
    return api
      .fetchJson({
        url: `/orders/${id}/move`,
        method: "POST",
        data: {
          orderStatus,
        },
      })
      .catch((e: ApiError) => {
        if (e.status) {
          enqueueSnackbar(formatMessage({ id: `snackbar.${e.message}` }), { variant: "error" });
        } else {
          console.error(e);
          enqueueSnackbar(formatMessage({ id: "snackbar.error" }), { variant: "error" });
        }
      });
  };

  const handleEdit = (order: IOrder) => {
    setSelectedOrder(order);
    setIsEditDialogOpen(true);
    navigate(`/kanban/${order.id}`);
  };

  useEffect(() => {
    void fetchOrders();
    const interval = setInterval(() => {
      void fetchOrders();
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  const handleOrderStatusChange = async (id: string, orderStatus: OrderStatus) => {
    await updateOrderStatus(id, orderStatus);
    await fetchOrders();
  };

  const handleEditConfirmed = (values: Partial<IOrder>, form: any): Promise<void> => {
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
          const errors = e.getLocalizedValidationErrors();

          Object.keys(errors).forEach(key => {
            form?.setError(name, { type: "custom", message: errors[key] });
          });
        } else if (e.status) {
          enqueueSnackbar(formatMessage({ id: `snackbar.${e.message}` }), { variant: "error" });
        } else {
          console.error(e);
          enqueueSnackbar(formatMessage({ id: "snackbar.error" }), { variant: "error" });
        }
      });
  };

  const handleEditCancel = (): void => {
    setIsEditDialogOpen(false);
    navigate("/kanban");
  };

  return (
    <Grid>
      <Breadcrumbs path={["dashboard", "kanban"]} />

      <PageHeader message="pages.kanban.title" />
      <Board initial={groupOrdersByStatus(orders)} onOrderStatusChange={handleOrderStatusChange} onEdit={handleEdit} />

      <EditOrderDialog
        onCancel={handleEditCancel}
        onConfirm={handleEditConfirmed}
        open={isEditDialogOpen}
        initialValues={selectedOrder}
      />
    </Grid>
  );
};
