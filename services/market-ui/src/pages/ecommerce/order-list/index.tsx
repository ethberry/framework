import { FC, Fragment } from "react";
import { Grid, Pagination } from "@mui/material";
import { DateRange } from "@mui/x-date-pickers-pro";

import { IOrder, OrderStatus } from "@framework/types";
import { PageHeader, ProgressOverlay } from "@gemunion/mui-page-layout";
import { useCollection } from "@gemunion/react-hooks";
import { IPaginationDto } from "@gemunion/types-collection";

import { OrderItem } from "./item";
import { OrderSearchForm } from "./form";
import { parseDateRange, stringifyDateRange } from "./utils";

export type TTransformedSearch = Omit<IOrderSearchDto, "dateRange"> & { dateRange: DateRange<Date> };

export interface IOrderSearchDto extends IPaginationDto {
  orderStatus: Array<OrderStatus>;
  dateRange: string;
}

export const OrderList: FC = () => {
  const { count, rows, isLoading, handleChangePage, handleSearch, search } = useCollection<IOrder, IOrderSearchDto>({
    baseUrl: "/orders",
    search: {
      take: 10,
      orderStatus: [OrderStatus.NEW, OrderStatus.NOW_IN_DELIVERY, OrderStatus.SCHEDULED],
      dateRange: stringifyDateRange(parseDateRange()),
    },
    embedded: true,
  });

  const transformSearch = ({ dateRange, ...rest }: IOrderSearchDto): TTransformedSearch => ({
    ...rest,
    dateRange: parseDateRange(dateRange),
  });

  const handleTransformedSearch = (values: TTransformedSearch) => {
    const { dateRange, ...rest } = values;

    const newSearch: IOrderSearchDto = {
      ...rest,
      dateRange: stringifyDateRange(dateRange),
    };

    return handleSearch(newSearch);
  };

  return (
    <Fragment>
      <PageHeader message="pages.orders.title" />

      <OrderSearchForm onSubmit={handleTransformedSearch} initialValues={transformSearch(search)} />

      <ProgressOverlay isLoading={isLoading}>
        <Grid container spacing={2}>
          {rows.map(order => (
            <OrderItem key={order.id} order={order} />
          ))}
        </Grid>
      </ProgressOverlay>

      <Pagination
        shape="rounded"
        page={search.skip / search.take + 1}
        count={Math.ceil(count / search.take)}
        onChange={handleChangePage}
      />
    </Fragment>
  );
};
