import { FC, useCallback, useEffect, useState } from "react";
import { Grid } from "@mui/material";
import { FormattedMessage, useIntl } from "react-intl";
import { DataGridPremiumProps, GridCellParams, GridRowParams } from "@mui/x-data-grid-premium";
import { format, parseISO } from "date-fns";

import { defaultItemsPerPage } from "@gemunion/constants";
import { IEventHistory, IToken } from "@framework/types";
import { ProgressOverlay } from "@gemunion/mui-page-layout";
import { TxHashLink } from "@gemunion/mui-scanner";
import { IHandleChangePaginationModelProps, useApiCall } from "@gemunion/react-hooks";

import { EventDataView } from "../../../pages/exchange/transactions/event-data-view";
import { StyledDataGridPremium, StyledTitle, wrapperMixin } from "./styled";

export interface ITokenHistoryProps {
  token: IToken;
}

export const TokenHistory: FC<ITokenHistoryProps> = props => {
  const { token } = props;

  const [rows, setRows] = useState<IEventHistory[]>([]);
  const [count, setCount] = useState<number>(0);
  const [search, setSearch] = useState({
    skip: 0,
    take: defaultItemsPerPage,
  });

  const handleChangePaginationModel = (model: IHandleChangePaginationModelProps) => {
    const { page, pageSize } = model;
    setSearch({
      skip: page * pageSize,
      take: pageSize,
    });
  };

  const { fn: getTokenHistoryFn, isLoading } = useApiCall(
    api =>
      api.fetchJson({
        url: "/events/token",
        data: {
          tokenId: token.id,
        },
      }),
    { success: false, error: false },
  );

  const getTokenHistory = async () => {
    const json = await getTokenHistoryFn();
    setRows(json.rows);
    setCount(json.count);
  };

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
      field: "eventType",
      headerName: formatMessage({ id: "form.labels.event" }),
      sortable: false,
      flex: 0.8,
    },
    {
      field: "createdAt",
      headerName: formatMessage({ id: "form.labels.date" }),
      sortable: false,
      valueFormatter: ({ value }: { value: string }) => format(parseISO(value), "MM/dd/yy hh:mm"),
      flex: 0.9,
    },
    {
      field: "transactionHash",
      headerName: formatMessage({ id: "form.labels.tx" }),
      sortable: false,
      renderCell: (params: GridCellParams<any, string>) => {
        return <TxHashLink hash={params.value as string} length={18} />;
      },
      flex: 1.2,
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

  useEffect(() => {
    if (!rows.length) {
      void getTokenHistory();
    }
  }, []);

  return (
    <ProgressOverlay isLoading={isLoading} wrapperSx={wrapperMixin}>
      <Grid item xs={12}>
        <StyledTitle variant="h5">
          <FormattedMessage id="pages.history.token.title" />
        </StyledTitle>
        <StyledDataGridPremium
          pagination
          rowCount={count || 0}
          paginationModel={{ page: search.skip / search.take, pageSize: search.take }}
          onPaginationModelChange={handleChangePaginationModel}
          pageSizeOptions={[5, 10, 25]}
          loading={isLoading}
          columns={columns}
          getDetailPanelHeight={getDetailPanelHeight}
          getDetailPanelContent={getDetailPanelContent}
          rows={rows || []}
          getRowHeight={() => "auto"}
          autoHeight
          disableAggregation
          disableRowGrouping
        />
      </Grid>
    </ProgressOverlay>
  );
};
