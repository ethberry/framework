import { FC, useCallback } from "react";
import { useIntl } from "react-intl";
import {
  DataGridPremium,
  DataGridPremiumProps,
  GridCellParams,
  gridClasses,
  GridRowParams,
} from "@mui/x-data-grid-premium";
import { format, parseISO } from "date-fns";

import { humanReadableDateTimeFormat } from "@gemunion/constants";
import { TxHashLink } from "@gemunion/mui-scanner";
import { useUser } from "@gemunion/provider-user";
import { useCollection } from "@gemunion/react-hooks";
import type { ICraft, IEventHistory, IExchangeLendEvent, IUser } from "@framework/types";
import { ContractEventType } from "@framework/types";
import { EventDataView } from "../../../../exchange/transactions/event-data-view";

export interface ICraftTransactionsProps {
  craft: ICraft;
}

export const CraftTransactions: FC<ICraftTransactionsProps> = props => {
  const { craft } = props;

  const { rows, count, search, isLoading, handleChangePaginationModel } = useCollection<IEventHistory, any>({
    search: {
      craftId: craft.id,
    },
    baseUrl: `/events/craft`,
    embedded: true, // excludes craftId from url
    redirect: () => "",
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
      sortable: false,
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
      sortable: false,
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
    <DataGridPremium
      pagination
      paginationMode="server"
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
      }}
      autoHeight
      disableAggregation
      disableRowGrouping
    />
  );
};
