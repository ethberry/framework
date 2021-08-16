import React, { ChangeEvent, FC, Fragment, useContext, useEffect, useState } from "react";
import { useSnackbar } from "notistack";
import { useIntl } from "react-intl";
import { Grid } from "@material-ui/core";
import { Pagination } from "@material-ui/lab";
import { parse, stringify } from "qs";
import { useHistory, useLocation } from "react-router";
import { PageHeader } from "@gemunion/material-ui-page-header";
import { ProgressOverlay } from "@gemunion/material-ui-progress";
import { ApiContext, ApiError } from "@gemunion/provider-api";
import { IOrder, OrderStatus } from "@gemunion/framework-types";
import { IPaginationResult, IPaginationDto } from "@gemunion/types-collection";

import { OrderItem } from "./item";
import { OrderSearchForm } from "./form";
import { parseDateRange, stringifyDateRange } from "./utils";

export interface IOrderSearchDto extends IPaginationDto {
  orderStatus: Array<OrderStatus>;
  dateRange: [Date, Date];
}

export const Orders: FC = () => {
  const location = useLocation();
  const history = useHistory();
  const { enqueueSnackbar } = useSnackbar();
  const { formatMessage } = useIntl();

  const [isLoading, setIsLoading] = useState(false);
  const [orders, setOrders] = useState<Array<IOrder>>([]);
  const [count, setCount] = useState<number>(0);

  const api = useContext(ApiContext);

  const parsedData = parse(location.search.substring(1));

  const [data, setData] = useState<IOrderSearchDto>({
    skip: 0,
    take: 10,
    orderStatus: [OrderStatus.NEW],
    ...parsedData,
    dateRange: parseDateRange(parsedData.dateRange as string),
  });

  const updateQS = (id?: number) => {
    const { skip: _skip, take: _take, dateRange, ...rest } = data;
    history.push(
      id
        ? `/orders/${id}`
        : `/orders?${stringify({
            ...rest,
            dateRange: stringifyDateRange(dateRange),
          })}`,
    );
  };

  const fetchOrders = async (): Promise<void> => {
    setIsLoading(true);
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
        setIsLoading(false);
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
      take: 10,
    });
  };

  useEffect(() => {
    void fetchOrders();
  }, [data]);

  return (
    <Fragment>
      <PageHeader message="pages.orders.title" />

      <OrderSearchForm onSubmit={handleSubmit} initialValues={data} />

      <ProgressOverlay isLoading={isLoading}>
        <Grid container spacing={2}>
          {orders.map(order => (
            <OrderItem key={order.id} order={order} />
          ))}
        </Grid>
      </ProgressOverlay>

      <Pagination
        shape="rounded"
        page={data.skip / data.take + 1}
        count={Math.ceil(count / data.take)}
        onChange={handleChangePage}
      />
    </Fragment>
  );
};
