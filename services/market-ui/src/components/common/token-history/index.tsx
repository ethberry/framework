import { FC, useCallback } from "react";
import { Grid } from "@mui/material";
import { FormattedMessage, useIntl } from "react-intl";
import { DataGridPremiumProps, GridCellParams, GridRowParams } from "@mui/x-data-grid-premium";
import { format, parseISO } from "date-fns";

import { IEventHistory, IToken } from "@framework/types";
import { ProgressOverlay } from "@gemunion/mui-page-layout";
import { TxHashLink } from "@gemunion/mui-scanner";
import { useCollection } from "@gemunion/react-hooks";

import { EventDataView } from "../../../pages/exchange/transactions/event-data-view";
import { StyledDataGridPremium, StyledTitle, wrapperMixin } from "./styled";

export interface ITokenHistoryProps {
  token: IToken;
}

export const TokenHistory: FC<ITokenHistoryProps> = props => {
  const { token } = props;

  const { rows, count, search, isLoading, handleChangePaginationModel } = useCollection<IEventHistory, any>({
    search: {
      tokenId: token.id,
    },
    baseUrl: `/events/token`,
    embedded: true, // excludes tokenId from url
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

  return (
    <ProgressOverlay isLoading={isLoading} wrapperSx={wrapperMixin}>
      <Grid item xs={12}>
        <StyledTitle variant="h5">
          <FormattedMessage id="pages.history.token.title" />
        </StyledTitle>
        <StyledDataGridPremium
          pagination
          paginationMode="server"
          rowCount={count || 0}
          paginationModel={{ page: search.skip / search.take, pageSize: search.take }}
          onPaginationModelChange={handleChangePaginationModel}
          pageSizeOptions={[5, 10, 25]}
          loading={isLoading}
          columns={columns}
          rowThreshold={0}
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
