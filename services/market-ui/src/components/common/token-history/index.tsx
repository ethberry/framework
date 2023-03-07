import { FC } from "react";
import { Grid, Typography } from "@mui/material";
import { FormattedMessage, useIntl } from "react-intl";
import { DataGrid, GridCellParams, useGridApiRef } from "@mui/x-data-grid";
import { format, parseISO } from "date-fns";

import { AddressLink, TxHashLink } from "@gemunion/mui-scanner";
import { ExchangeType, IAsset, IAssetComponent, IBreed, IEventHistory, IToken } from "@framework/types";

import { sorter } from "../../../utils/sorter";
import { formatPrice } from "../../../utils/money";

import { useStyles } from "./styles";

export interface ITokenWithHistory extends IToken {
  contractHistory?: Array<IEventHistory>;
  breeds?: Array<IBreed>;
}

export interface ITokenHistoryCombined {
  price: { components: Array<IAssetComponent> };
  from: string;
  to: string;
  type: string;
  date: string;
  tx: string;
  id: number;
}

export interface ITokenHistoryProps {
  token: ITokenWithHistory;
  isLoading: boolean;
  search: any;
  handleChangePage: (_e: React.ChangeEvent<unknown>, page: number) => void;
  handleChangeRowsPerPage: any;
}

export const TokenHistory: FC<ITokenHistoryProps> = props => {
  const { token, isLoading, search, handleChangePage, handleChangeRowsPerPage } = props;
  const classes = useStyles();
  const { formatMessage } = useIntl();
  const apiRef = useGridApiRef();

  const exchangeHistory =
    token.exchange
      ?.filter(sale => sale.exchangeType === ExchangeType.ITEM)
      ?.map(history => {
        return {
          price: {
            components:
              history.history?.assets
                ?.filter(asset => asset.exchangeType === ExchangeType.PRICE)
                .map(asset => {
                  return {
                    amount: asset.amount,
                    contract: {
                      decimals: asset.contract!.decimals,
                      symbol: asset.contract!.symbol,
                    },
                  };
                }) || ([] as Array<any>),
          },
          from: history.history?.address || "",
          // @ts-ignore
          to: history.history?.eventData?.from,
          type: history.history?.eventType as string,
          date: history.history?.updatedAt || "",
          tx: history.history?.transactionHash || "",
          // quantity: 1,
        };
      }) || [];

  const contractHistory =
    token.history?.map(history => {
      return {
        price: {
          components: [] as Array<any>,
        },
        // @ts-ignore
        from: (history.eventData.from as string) || (history.eventData.owner as string),
        // @ts-ignore
        to: history.eventData.to || history.eventData.approved || "",
        type: history.eventType as string,
        date: history.updatedAt,
        tx: history.transactionHash,
        // quantity: 1,
      };
    }) || [];

  const fullTokenHistory: Array<ITokenHistoryCombined> = contractHistory
    .concat(exchangeHistory)
    .sort(sorter("date"))
    .map((history, i: number) => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return Object.assign(history, { id: i });
    });

  // prettier-ignore
  const columns = [
    {
      field: "type",
      headerName: formatMessage({ id: "form.labels.event" }),
      sortable: false,
      flex: 1,
      minWidth: 120
    },
    {
      field: "price",
      headerName: formatMessage({ id: "form.labels.price" }),
      sortable: false,
      valueFormatter: ({ value }: { value: IAsset }) => value ? formatPrice(value) : "",
      renderCell: (params: GridCellParams<any, any>) => {
        let value = params.value;
        if (params.colDef.valueFormatter) {
          value = params.colDef.valueFormatter({
            value: params.value,
            field: "",
            api: apiRef.current,
          });
        }
        return (
          value ?
            <ul className={classes.price}>
              {value.split(", ").map((item: string, index: number) => (
                <li key={index}>{item}</li>
              ))}
            </ul> : null
        );
      },
      flex: 1.3,
      minWidth: 100
    },
    // {
    //   field: "quantity",
    //   headerName: formatMessage({ id: "form.labels.quantity" }),
    //   sortable: false,
    //   flex: 0.8
    // },
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
      valueFormatter: ({ value }: { value: string }) => format(parseISO(value), "MM/dd/yy hh:mm"),
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

  return fullTokenHistory && fullTokenHistory.length ? (
    <Grid item xs={12}>
      <Typography variant="h5" className={classes.title}>
        <FormattedMessage id="pages.history.token.title" />
      </Typography>
      <DataGrid
        pagination
        paginationMode="server"
        rowCount={fullTokenHistory.length}
        paginationModel={{ page: search.skip / search.take + 1, pageSize: search.take }}
        onPaginationModelChange={({ page, pageSize }) => {
          handleChangePage(null as any, page + 1);
          handleChangeRowsPerPage(pageSize);
        }}
        pageSizeOptions={[5, 10, 25]}
        loading={isLoading}
        columns={columns}
        rows={fullTokenHistory}
        getRowId={row => row.id}
        autoHeight
      />
    </Grid>
  ) : null;
};
