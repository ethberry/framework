import { FC, useEffect } from "react";
import { Button, Grid } from "@mui/material";
import { DataGrid, GridCellParams } from "@mui/x-data-grid";
import { useWeb3React } from "@web3-react/core";
import { FormattedMessage, useIntl } from "react-intl";
import { useClipboard } from "use-clipboard-copy";

import type { IReferralReportSearchDto } from "@framework/types";
import { AddressLink } from "@gemunion/mui-scanner";
import { Breadcrumbs, PageHeader } from "@gemunion/mui-page-layout";
import { useWallet } from "@gemunion/provider-wallet";
import { useCollection } from "@gemunion/react-hooks";

import { StyledCopyRefLinkWrapper, StyledTextField } from "./styled";

export interface IReferralTreeSearchDto extends IReferralReportSearchDto {
  merchantIds: Array<number>;
}

export interface IReferralTreeChain {
  id: number;
  merchant: string;
  wallet: string;
  reflen: number;
  share: number;
}

export const ReferralTree: FC = () => {
  const {
    count,
    rows,
    search,
    isLoading,
    // isFiltersOpen,
    // handleToggleFilters,
    // handleSearch,
    handleChangePaginationModel,
  } = useCollection<IReferralTreeChain, IReferralTreeSearchDto>({
    baseUrl: "/referral/tree",
    search: {
      merchantIds: [], // search by all merchants
    },
  });

  const { isActive, account = "" } = useWeb3React();
  const { openConnectWalletDialog, closeConnectWalletDialog } = useWallet();
  const clipboard = useClipboard();
  const { formatMessage } = useIntl();

  // prettier-ignore
  // TODO make it nice
  const columns = [
    // {
    //   field: "id",
    //   headerName: formatMessage({ id: "form.labels.id" }),
    //   sortable: true,
    //   flex: 0.05
    // },
    {
      field: "merchant",
      headerName: formatMessage({ id: "form.labels.merchant" }),
      sortable: true,
      flex: 1,
      // minWidth: 100
    },
    {
      field: "wallet",
      headerName: formatMessage({ id: "form.labels.wallet" }),
      sortable: false,
      renderCell: (params: GridCellParams<any, string>) => {
        return (
          <AddressLink address={params.value} />
        );
      },
      flex: 1.5,
      minWidth: 150
    },
    {
      field: "reflen",
      headerName: formatMessage({ id: "form.labels.level" }),
      sortable: true,
      flex: 0.3,
    },
    {
      field: "share",
      headerName: formatMessage({ id: "form.labels.share" }),
      sortable: true,
      flex: 0.5,
      minWidth: 50
    },
  ];

  useEffect(() => {
    if (!isActive) {
      void openConnectWalletDialog();
    } else {
      void closeConnectWalletDialog();
    }
  }, [isActive]);

  return (
    <Grid>
      <Breadcrumbs path={["dashboard", "referral", "referral.tree"]} />

      <PageHeader message="pages.referral.tree.title"></PageHeader>

      <StyledCopyRefLinkWrapper>
        <StyledTextField
          value={`${process.env.MARKET_FE_URL}/?referrer=${account.toLowerCase()}`}
          variant="standard"
          inputRef={clipboard.target}
        />
        <Button onClick={clipboard.copy}>
          <FormattedMessage id="form.buttons.copy" />
        </Button>
      </StyledCopyRefLinkWrapper>

      {rows.length > 0 ? (
        <DataGrid
          pagination
          paginationMode="server"
          rowCount={count}
          paginationModel={{ page: search.skip / search.take, pageSize: search.take }}
          onPaginationModelChange={handleChangePaginationModel}
          pageSizeOptions={[5, 10, 25, 100]}
          loading={isLoading}
          columns={columns}
          rows={rows.map((tree: IReferralTreeChain, idx) => ({
            id: idx,
            merchant: tree.merchant,
            wallet: tree.wallet,
            share: `${tree.share / 100}%`,
            reflen: tree.reflen,
          }))}
          autoHeight
        />
      ) : null}
    </Grid>
  );
};
