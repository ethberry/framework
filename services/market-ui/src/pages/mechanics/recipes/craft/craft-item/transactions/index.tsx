import { FC, useCallback } from "react";
import { useIntl } from "react-intl";
import {
  DataGridPremiumProps,
  GridRenderCellParams,
  GridRowParams,
  GridTreeNodeWithRender,
  GridValidRowModel,
} from "@mui/x-data-grid-premium";
import { format, parseISO } from "date-fns";

import { humanReadableDateTimeFormat } from "@gemunion/constants";
import { AddressLink, TxHashLink } from "@gemunion/mui-scanner";
import { useCollection } from "@gemunion/react-hooks";
import type { ICraft, IEventHistory } from "@framework/types";

import { EventDataView } from "../../../../../exchange/transactions/event-data-view";
import { StyledDataGridPremium } from "./styled";

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

  const columns = [
    {
      field: "id",
      headerName: formatMessage({ id: "form.labels.id" }),
      sortable: false,
      flex: 1,
      minWidth: 100,
    },
    {
      field: "address",
      headerName: formatMessage({ id: "form.labels.address" }),
      sortable: false,
      renderCell: (params: GridRenderCellParams<GridValidRowModel, string, IEventHistory, GridTreeNodeWithRender>) => {
        return <AddressLink address={params.value} length={15} />;
      },
      flex: 1,
      minWidth: 160,
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
      renderCell: (params: GridRenderCellParams<GridValidRowModel, string, IEventHistory, GridTreeNodeWithRender>) => {
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
    <StyledDataGridPremium
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
      autoHeight
      disableAggregation
      disableRowGrouping
    />
  );
};
