import { FC, useCallback } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import { Button, Grid } from "@mui/material";
import { FilterList } from "@mui/icons-material";
import {
  DataGridPremium,
  DataGridPremiumProps,
  GridCellParams,
  gridClasses,
  GridRowParams,
} from "@mui/x-data-grid-premium";
import { format, parseISO } from "date-fns";
import { stringify } from "qs";

import { humanReadableDateTimeFormat } from "@gemunion/constants";
import { Breadcrumbs, PageHeader } from "@gemunion/mui-page-layout";
import { TxHashLink } from "@gemunion/mui-scanner";
import { useUser } from "@gemunion/provider-user";
import { useCollection } from "@gemunion/react-hooks";
import type { IEventHistory, IExchangeLendEvent, IUser } from "@framework/types";
import { ContractEventType } from "@framework/types";

import { EventDataView } from "./event-data-view";
import type { IEventSearchDto } from "./form";
import { TransactionSearchForm } from "./form";

export const MyTransactions: FC = () => {
  const {
    rows,
    count,
    search,
    isLoading,
    isFiltersOpen,
    handleSearch,
    handleToggleFilters,
    handleChangePaginationModel,
    handleChangeSortModel,
  } = useCollection<IEventHistory, IEventSearchDto>({
    search: {
      eventTypes: [],
    },
    baseUrl: "/events/my",
    redirect: (_, search) => `/transactions?${stringify(search)}`,
  });

  const { formatMessage } = useIntl();
  const { profile } = useUser<IUser>();

  const columns = [
    {
      field: "id",
      headerName: formatMessage({ id: "form.labels.id" }),
      sortable: false,
      flex: 1,
      minWidth: 100,
    },
    {
      field: "eventType",
      headerName: formatMessage({ id: "form.labels.eventType" }),
      sortable: true,
      flex: 2,
      renderCell: (params: GridCellParams<IEventHistory>) => {
        const { eventData, eventType } = params.row;
        const isBorrow =
          eventType === ContractEventType.Lend && profile.wallet !== (eventData as IExchangeLendEvent).from;
        return <>{isBorrow ? formatMessage({ id: "enums.eventDataLabel.borrow" }) : eventType}</>;
      },
      minWidth: 160,
    },
    {
      field: "chainId",
      headerName: formatMessage({ id: "form.labels.network" }),
      sortable: false,
      valueFormatter: ({ value }: { value: number }) => formatMessage({ id: `enums.chainId.${value}` }),
      flex: 1,
      minWidth: 120,
    },
    {
      field: "createdAt",
      headerName: formatMessage({ id: "form.labels.date" }),
      sortable: true,
      valueFormatter: ({ value }: { value: string }) => format(parseISO(value), humanReadableDateTimeFormat),
      flex: 1.2,
      minWidth: 160,
    },
    {
      field: "transactionHash",
      headerName: formatMessage({ id: "form.labels.tx" }),
      sortable: false,
      renderCell: (params: GridCellParams<IEventHistory, string>) => {
        return <TxHashLink hash={params.value as string} />;
      },
      flex: 1,
      minWidth: 160,
    },
  ];

  const getDetailPanelContent = useCallback<NonNullable<DataGridPremiumProps["getDetailPanelContent"]>>(
    ({ row }: GridRowParams<IEventHistory>) => <EventDataView row={row} />,
    [],
  );

  const getDetailPanelHeight = useCallback<NonNullable<DataGridPremiumProps["getDetailPanelHeight"]>>(
    () => "auto" as const,
    [],
  );

  return (
    <Grid>
      <Breadcrumbs path={["dashboard", "transactions"]} />

      <PageHeader message="pages.transactions.title">
        <Button startIcon={<FilterList />} onClick={handleToggleFilters}>
          <FormattedMessage
            id={`form.buttons.${isFiltersOpen ? "hideFilters" : "showFilters"}`}
            data-testid="ToggleFiltersButton"
          />
        </Button>
      </PageHeader>

      <TransactionSearchForm onSubmit={handleSearch} initialValues={search} open={isFiltersOpen} />

      <DataGridPremium
        pagination
        paginationMode="server"
        sortingMode="server"
        onSortModelChange={handleChangeSortModel as any}
        rowCount={count}
        paginationModel={{ page: search.skip / search.take, pageSize: search.take }}
        onPaginationModelChange={handleChangePaginationModel}
        pageSizeOptions={[5, 10, 25]}
        loading={isLoading}
        columns={columns}
        rowThreshold={0}
        getDetailPanelHeight={getDetailPanelHeight}
        getDetailPanelContent={getDetailPanelContent}
        rows={rows}
        getRowHeight={() => "auto"}
        sx={{
          [`& .${gridClasses.cell}`]: {
            p: 1.5,
          },
          [`& .${gridClasses["row--detailPanelExpanded"]} .${gridClasses.cell}`]: {
            borderBottom: "none",
          },
        }}
        autoHeight
        disableAggregation
        disableRowGrouping
      />
    </Grid>
  );
};
