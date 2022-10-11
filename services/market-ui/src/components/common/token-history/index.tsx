import { FC } from "react";
import { Grid, Typography } from "@mui/material";
import { FormattedMessage, useIntl } from "react-intl";
import { DataGrid, GridCellParams } from "@mui/x-data-grid";
import { format, parseISO } from "date-fns";

import { ExchangeType, IAsset, IToken } from "@framework/types";

import { sorter } from "../../../utils/sorter";
import { formatPrice } from "../../../utils/money";
import { ScannerLink, TxLink } from "../scanner-link";

import { useStyles } from "./styles";

export interface ITokenHistoryProps {
  token: IToken;
  isLoading: boolean;
  search: any;
  handleChangePage: (_e: React.ChangeEvent<unknown>, page: number) => void;
  handleChangeRowsPerPage: any;
}

export const TokenHistory: FC<ITokenHistoryProps> = props => {
  const { token, isLoading, search, handleChangePage, handleChangeRowsPerPage } = props;
  const classes = useStyles();
  const { formatMessage } = useIntl();

  const exchangeHistory =
    token.exchangeHistory
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

  const contractHistory = token.contractHistory?.map(history => {
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
  });

  const fullTokenHistory = contractHistory
    ?.concat(exchangeHistory)
    .sort(sorter("date"))
    .map((history, i: number) => {
      return Object.assign(history, { id: i });
    });

  // prettier-ignore
  const columns = [
    {
      field: "type",
      headerName: formatMessage({ id: "form.labels.event" }),
      sortable: false,
      flex: 1
    },
    {
      field: "price",
      headerName: formatMessage({ id: "form.labels.price" }),
      sortable: false,
      valueFormatter: ({ value }: { value: IAsset }) => value ? formatPrice(value) : "",
      renderCell: (params: GridCellParams) => {
        let value = params.value;
        if (params.colDef.valueFormatter) {
          value = params.colDef.valueFormatter({
            value: params.value,
            field: "",
            api: undefined
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
      flex: 1.3
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
      renderCell: (params: GridCellParams) => {
        return (
          <ScannerLink address={params.value} type={"address"} />
        );
      },
      flex: 2
    },
    {
      field: "to",
      headerName: formatMessage({ id: "form.labels.to" }),
      sortable: false,
      renderCell: (params: GridCellParams) => {
        return (
          <ScannerLink address={params.value} type={"address"} />
        );
      },
      flex: 2
    },
    {
      field: "date",
      headerName: formatMessage({ id: "form.labels.date" }),
      sortable: false,
      valueFormatter: ({ value }: { value: string }) => format(parseISO(value), "MM/dd/yy hh:mm"),
      flex: 1.2
    },
    {
      field: "tx",
      headerName: formatMessage({ id: "form.labels.tx" }),
      sortable: false,
      renderCell: (params: GridCellParams) => {
        return (
          <TxLink address={params.value} />
        );
      },
      flex: 1
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
        pageSize={search.take}
        onPageChange={page => handleChangePage(null as any, page + 1)}
        onPageSizeChange={handleChangeRowsPerPage}
        rowsPerPageOptions={[5, 10, 25]}
        loading={isLoading}
        columns={columns}
        rows={fullTokenHistory}
        getRowId={row => row.id}
        autoHeight
      />
    </Grid>
  ) : null;
};
