import { FC, useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { useSnackbar } from "notistack";
import { FormattedMessage, useIntl } from "react-intl";
import { Button, Grid } from "@mui/material";
import { Add } from "@mui/icons-material";

import { IOrder, OrderStatus } from "@framework/types";
import { Breadcrumbs, PageHeader } from "@gemunion/mui-page-layout";
import { useApiCall } from "@gemunion/react-hooks";
import { IPaginationResult } from "@gemunion/types-collection";

import { emptyOrder } from "../../../components/common/interfaces";
import { EditOrderDialog } from "../order/edit";
import { groupOrdersByStatus } from "../order/utils";
import { Board } from "./board";

export const Kanban: FC = () => {
  const [orders, setOrders] = useState<Array<IOrder>>([]);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<IOrder>(emptyOrder);

  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const { formatMessage } = useIntl();

  const { fn: fetchOrdersApi } = useApiCall(
    api =>
      api
        .fetchJson({
          url: "/orders",
          data: {
            orderStatus: [OrderStatus.NEW, OrderStatus.SCHEDULED, OrderStatus.NOW_IN_DELIVERY, OrderStatus.DELIVERED],
            isArchived: false,
          },
        })
        .then((json: IPaginationResult<IOrder>) => {
          setOrders(json.rows);
        }),
    { success: false },
  );

  const fetchOrders = (): Promise<void> => {
    return fetchOrdersApi(undefined);
  };

  const { fn: updateOrderStatusApi } = useApiCall(
    (api, data: { id: string; orderStatus: OrderStatus }) => {
      const { id, orderStatus } = data;
      return api.fetchJson({
        url: `/orders/${id}/move`,
        method: "POST",
        data: {
          orderStatus,
        },
      });
    },
    { success: false },
  );

  const updateOrderStatus = (id: string, orderStatus: OrderStatus) => {
    return updateOrderStatusApi(undefined, { id, orderStatus });
  };

  const handleEdit = (order: IOrder) => {
    setSelectedOrder(order);
    setIsEditDialogOpen(true);
    navigate(`/kanban/${order.id}`);
  };

  const handleCreate = () => {
    setSelectedOrder(emptyOrder);
    setIsEditDialogOpen(true);
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

  const { fn: handleEditConfirmedApi } = useApiCall(
    (api, values: Partial<IOrder>) => {
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
        });
    },
    { success: false },
  );

  const handleEditConfirmed = (values: Partial<IOrder>, form: any): Promise<void> => {
    return handleEditConfirmedApi(form, values);
  };

  const handleEditCancel = (): void => {
    setIsEditDialogOpen(false);
    navigate("/kanban");
  };

  return (
    <Grid>
      <Breadcrumbs path={["dashboard", "kanban"]} />

      <PageHeader message="pages.kanban.title">
        <Button variant="outlined" startIcon={<Add />} onClick={handleCreate}>
          <FormattedMessage id="form.buttons.create" />
        </Button>
      </PageHeader>

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
