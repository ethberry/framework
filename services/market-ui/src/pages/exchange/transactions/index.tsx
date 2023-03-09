import { FC } from "react";
import { useIntl } from "react-intl";
import { Grid } from "@mui/material";
import { DataGrid, GridCellParams } from "@mui/x-data-grid";
import { format, parseISO } from "date-fns";
import { ethers } from "ethers";

import { ContractEventType, IEventHistory, IExchangePurchaseEvent } from "@framework/types";
import { humanReadableDateTimeFormat } from "@gemunion/constants";
import { Breadcrumbs, PageHeader } from "@gemunion/mui-page-layout";
import { AddressLink, TxHashLink } from "@gemunion/mui-scanner";
import { useCollection } from "@gemunion/react-hooks";

export const MyTransactions: FC = () => {
  const { rows, count, search, isLoading, handleChangePaginationModel } = useCollection<IEventHistory>({
    baseUrl: "/events/my",
  });

  const { formatMessage } = useIntl();

  // prettier-ignore
  const columns = [
    {
      field: "id",
      headerName: formatMessage({ id: "form.labels.event" }),
      sortable: false,
      flex: 1,
      minWidth: 120
    },
    {
      field: "type",
      headerName: formatMessage({ id: "form.labels.event" }),
      sortable: false,
      flex: 1,
      minWidth: 120
    },
    {
      field: "from",
      headerName: formatMessage({ id: "form.labels.from" }),
      sortable: false,
      renderCell: (params: GridCellParams<any, string>) => {
        return (
          <AddressLink address={params.value} />
        );
      },
      flex: 2,
      minWidth: 360
    },
    {
      field: "to",
      headerName: formatMessage({ id: "form.labels.to" }),
      sortable: false,
      renderCell: (params: GridCellParams<any, string>) => {
        return (
          <AddressLink address={params.value} />
        );
      },
      flex: 2,
      minWidth: 360
    },
    {
      field: "date",
      headerName: formatMessage({ id: "form.labels.date" }),
      sortable: false,
      valueFormatter: ({ value }: { value: string }) => format(parseISO(value), humanReadableDateTimeFormat),
      flex: 1.2,
      minWidth: 160
    },
    {
      field: "tx",
      headerName: formatMessage({ id: "form.labels.tx" }),
      sortable: false,
      renderCell: (params: GridCellParams<any, string>) => {
        return (
          <TxHashLink hash={params.value as string} />
        );
      },
      flex: 1,
      minWidth: 360
    }
  ];

  return (
    <Grid>
      <Breadcrumbs path={["dashboard", "my-transactions"]} />

      <PageHeader message="pages.transactions.title" />

      <DataGrid
        pagination
        paginationMode="server"
        rowCount={count}
        paginationModel={{ page: search.skip / search.take, pageSize: search.take }}
        onPaginationModelChange={handleChangePaginationModel}
        pageSizeOptions={[5, 10, 25]}
        loading={isLoading}
        columns={columns}
        rows={rows.map((event: IEventHistory) => ({
          id: event.id,
          chainId: event.chainId,
          type: event.eventType,
          amount:
            event.eventType === ContractEventType.Purchase
              ? ethers.utils.formatEther((event.eventData as IExchangePurchaseEvent).price[0][3])
              : event.eventType,
          date: event.createdAt,
          tx: event.transactionHash,
        }))}
        autoHeight
      />
    </Grid>
  );
};
