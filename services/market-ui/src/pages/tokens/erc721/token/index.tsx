import { FC, Fragment } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import { format, parseISO } from "date-fns";

import { Grid, Paper, Typography } from "@mui/material";
import { DataGrid, GridCellParams } from "@mui/x-data-grid";

import { Breadcrumbs, PageHeader, Spinner } from "@gemunion/mui-page-layout";
import { RichTextDisplay } from "@gemunion/mui-rte";
import { useCollection } from "@gemunion/react-hooks";
import { emptyStateString } from "@gemunion/draft-js-utils";

import type { IAsset, IContractHistory, ITemplate, IToken } from "@framework/types";
import { ContractFeatures, ExchangeType } from "@framework/types";

import { TokenSellButton, TokenTransferButton, UpgradeButton } from "../../../../components/buttons";
import { formatEther, formatPrice } from "../../../../utils/money";
import { TokenAttributesView } from "../../genes";
import { ScannerLink, TxLink } from "../../../../components/common/scanner-link";

import { useStyles } from "./styles";

export interface ITokenWithHistory extends IToken {
  contractHistory: Array<IContractHistory>;
}

export interface IObj {
  [key: string]: any;
}

export const Erc721Token: FC = () => {
  const { selected, isLoading, search, handleChangeRowsPerPage, handleChangePage } = useCollection<ITokenWithHistory>({
    baseUrl: "/erc721-tokens",
    empty: {
      template: {
        title: "",
        description: emptyStateString,
      } as ITemplate,
    },
  });

  const classes = useStyles();
  const { formatMessage } = useIntl();

  if (isLoading) {
    return <Spinner />;
  }

  const sorter = (sortBy: string) => (a: IObj, b: IObj) => a[sortBy].toLowerCase() > b[sortBy].toLowerCase() ? 1 : -1;

  const exchangeSaleHistory =
    selected.history
      ?.filter(sale => sale.exchangeType === ExchangeType.ITEM)
      ?.map(history => {
        return {
          price:
            // history.history?.assets?.filter(asset => asset.exchangeType === ExchangeType.PRICE) || ([] as Array<any>),
            history.history?.assets
              ?.filter(asset => asset.exchangeType === ExchangeType.PRICE)
              .map(asset => {
                return {
                  amount: asset.amount,
                  tokenType: asset.contract!.contractType,
                  symbol: asset.contract!.symbol,
                  name: asset.contract!.name,
                  decimals: asset.contract!.decimals,
                };
              }) || ([] as Array<any>),
          from: history.history?.address || "",
          // @ts-ignore
          to: history.history?.eventData?.from,
          type: history.history?.eventType as string,
          date: history.history?.updatedAt || "",
          tx: history.history?.transactionHash || "",
          quantity: 1,
        };
      }) || [];

  const contractHistory = selected.contractHistory?.map(history => {
    return {
      price: [] as Array<any>,
      // @ts-ignore
      from: (history.eventData.from as string) || (history.eventData.owner as string),
      // @ts-ignore
      to: history.eventData.to || history.eventData.approved || "",
      type: history.eventType as string,
      date: history.updatedAt,
      tx: history.transactionHash,
      quantity: 1,
    };
  });

  const fullTokenHistory = contractHistory
    ?.concat(exchangeSaleHistory)
    .sort(sorter("date"))
    .map((history, indx) => {
      return Object.assign(history, { id: indx });
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
      // TODO map price items ???
      valueFormatter: ({ value }: { value: Array<{ amount: string }> }) => value[0] ? formatEther(value[0].amount) : "",
      // valueFormatter: ({ value }: { value: Array<IAsset> }) => value[0] ? formatPrice(value) : "",
      flex: 0.7
    },
    {
      field: "quantity",
      headerName: formatMessage({ id: "form.labels.quantity" }),
      sortable: false,
      flex: 0.8
    },
    {
      field: "from",
      headerName: formatMessage({ id: "form.labels.from" }),
      sortable: false,
      renderCell: (params: GridCellParams) => {
        return (
          <ScannerLink address={params.value} />
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
          <ScannerLink address={params.value} />
        );
      },
      flex: 2
    },
    {
      field: "date",
      headerName: formatMessage({ id: "form.labels.date" }),
      sortable: false,
      valueFormatter: ({ value }: { value: string }) => format(parseISO(value), "MM/dd/yy hh:mm"),
      flex: 1.3
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

  return (
    <Fragment>
      <Breadcrumbs
        path={{
          dashboard: "dashboard",
          "erc721.tokens": "erc721-tokens",
          "erc721.token": "erc721.token",
        }}
        data={[{}, {}, selected.template]}
      />

      <PageHeader message="pages.erc721.token.title" data={selected.template} />

      <Grid container>
        <Grid item xs={9}>
          <img src={selected.template!.imageUrl} />
          <Typography variant="body2" color="textSecondary" component="div" className={classes.preview}>
            <RichTextDisplay data={selected.template!.description} />
          </Typography>
        </Grid>
        <Grid item xs={3}>
          <Paper className={classes.paper}>
            <Typography>
              <FormattedMessage
                id="pages.erc721.token.price"
                values={{ amount: formatPrice(selected.template?.price) }}
              />
            </Typography>
            <TokenSellButton token={selected} />
            <TokenTransferButton token={selected} />
          </Paper>

          {selected.template?.contract?.contractFeatures.includes(ContractFeatures.UPGRADEABLE) ? (
            <Paper className={classes.paper}>
              <Typography>
                <FormattedMessage id="pages.erc721.token.level" values={selected.attributes} />
              </Typography>
              <UpgradeButton token={selected} />
            </Paper>
          ) : null}

          {selected.template?.contract?.contractFeatures.includes(ContractFeatures.GENES) ? (
            <Paper className={classes.paper}>
              <Typography>
                <FormattedMessage id="pages.erc721.token.genes" />
              </Typography>
              <TokenAttributesView attributes={selected.attributes} />
            </Paper>
          ) : null}
        </Grid>
        {fullTokenHistory ? (
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
        ) : null}
      </Grid>
    </Fragment>
  );
};
