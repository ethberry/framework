import { FC } from "react";
import { FormattedMessage } from "react-intl";
import { Button, Grid, ListItemText } from "@mui/material";
import { Add, Create, Delete, FilterList } from "@mui/icons-material";
import { DateRange } from "@mui/x-date-pickers-pro";

import { ListAction, ListActions, StyledListItem, StyledListWrapper, StyledPagination } from "@framework/styled";
import type { IOrder } from "@framework/types";
import { OrderStatus } from "@framework/types";
import { DeleteDialog } from "@gemunion/mui-dialog-delete";
import { Breadcrumbs, PageHeader, ProgressOverlay } from "@gemunion/mui-page-layout";
import { useCollection, CollectionActions } from "@gemunion/react-hooks";
import type { IPaginationDto } from "@gemunion/types-collection";

import { emptyOrder } from "../../../components/common/interfaces";
import { EditOrderDialog } from "./edit";
import { OrderSearchForm } from "./form";
import { parseDateRange, stringifyDateRange } from "./utils";

// @ts-ignore
export type TTransformedSearch = Omit<IOrderSearchDto, "dateRange"> & { dateRange: DateRange<Date> };

export interface IOrderSearchDto extends IPaginationDto {
  orderStatus: Array<OrderStatus>;
  isArchived?: boolean;
  dateRange: string;
  merchantId?: number;
}

export const Order: FC = () => {
  const {
    rows,
    count,
    search,
    action,
    selected,
    isLoading,
    isFiltersOpen,
    handleCreate,
    handleDelete,
    handleDeleteCancel,
    handleDeleteConfirm,
    handleEdit,
    handleEditCancel,
    handleEditConfirm,
    handleSearch,
    handleToggleFilters,
    handleChangePage,
  } = useCollection<IOrder, IOrderSearchDto>({
    baseUrl: "/orders",
    empty: emptyOrder,
    search: {
      take: 10,
      isArchived: true,
      orderStatus: [OrderStatus.NEW],
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
    <Grid>
      <Breadcrumbs path={["dashboard", "orders"]} />

      <PageHeader message="pages.orders.title">
        <Button startIcon={<FilterList />} onClick={handleToggleFilters} data-testid="ToggleFilterButton">
          <FormattedMessage id={`form.buttons.${isFiltersOpen ? "hideFilters" : "showFilters"}`} />
        </Button>
        <Button variant="outlined" startIcon={<Add />} onClick={handleCreate} data-testid="EcommerceOrderCreateButton">
          <FormattedMessage id="form.buttons.create" />
        </Button>
      </PageHeader>

      <OrderSearchForm
        onSubmit={handleTransformedSearch}
        initialValues={transformSearch(search)}
        open={isFiltersOpen}
      />

      <ProgressOverlay isLoading={isLoading}>
        <StyledListWrapper count={rows.length} isLoading={isLoading}>
          {rows.map(order => (
            <StyledListItem key={order.id}>
              <ListItemText>Order #{order.id}</ListItemText>
              <ListActions>
                <ListAction onClick={handleEdit(order)} message="form.buttons.edit" icon={Create} />
                <ListAction onClick={handleDelete(order)} message="form.buttons.delete" icon={Delete} />
              </ListActions>
            </StyledListItem>
          ))}
        </StyledListWrapper>
      </ProgressOverlay>

      <StyledPagination
        shape="rounded"
        page={search.skip / search.take + 1}
        count={Math.ceil(count / search.take)}
        onChange={handleChangePage}
      />

      <DeleteDialog
        onCancel={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        open={action === CollectionActions.delete}
        initialValues={selected}
        getTitle={(order: IOrder) => `Order #${order.id}`}
      />

      <EditOrderDialog
        onCancel={handleEditCancel}
        onConfirm={handleEditConfirm}
        open={action === CollectionActions.edit}
        initialValues={selected}
      />
    </Grid>
  );
};
