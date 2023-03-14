import { ChangeEvent, FC, Fragment, useContext, useState } from "react";
import { useSnackbar } from "notistack";
import { useIntl } from "react-intl";
import { Grid, Pagination } from "@mui/material";
import { parse, stringify } from "qs";
import { useLocation, useNavigate } from "react-router";
import { PageHeader, ProgressOverlay } from "@gemunion/mui-page-layout";
import { ApiContext, ApiError } from "@gemunion/provider-api-firebase";
import { IOrder, OrderStatus } from "@framework/types";
import { IPaginationDto, IPaginationResult } from "@gemunion/types-collection";
import useDeepCompareEffect from "use-deep-compare-effect";

import { OrderItem } from "./item";
import { OrderSearchForm } from "./form";
import { parseDateRange, stringifyDateRange } from "./utils";

export interface IOrderSearchDto extends IPaginationDto {
  orderStatus: Array<OrderStatus>;
  dateRange: [Date, Date];
}

export const OrderList: FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
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
    orderStatus: [OrderStatus.NEW, OrderStatus.NOW_IN_DELIVERY, OrderStatus.SCHEDULED],
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

  const handleSubmit = (values: IOrderSearchDto): Promise<void> => {
    setData({
      ...values,
      skip: 0,
      take: 10,
    });
    return Promise.resolve();
  };

  useDeepCompareEffect(() => {
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
