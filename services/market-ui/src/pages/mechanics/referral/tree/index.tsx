import { FC } from "react";
import { useIntl } from "react-intl";

import { Grid } from "@mui/material";

import { DataGrid, GridCellParams } from "@mui/x-data-grid";

import { AddressLink } from "@gemunion/mui-scanner";
import { Breadcrumbs, PageHeader } from "@gemunion/mui-page-layout";
import { useCollection } from "@gemunion/react-hooks";

import type { IReferralReportSearchDto } from "@framework/types";

export interface IReferralTreeSearchDto extends IReferralReportSearchDto {
  merchantIds: Array<number>;
}

export enum RefClaimStatus {
  NEW = "NEW",
  CREATED = "CREATED",
  CLAIMED = "CLAIMED",
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
    // search,
    isLoading,
    // isFiltersOpen,
    // handleToggleFilters,
    // handleSearch,
    // handleChangePage,
    handleChangePaginationModel,
  } = useCollection<IReferralTreeChain, IReferralTreeSearchDto>({
    baseUrl: "/referral/tree",
    search: {
      merchantIds: [1, 2, 3, 4], // search by all merchants
    },
  });

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

  return (
    <Grid>
      <Breadcrumbs path={["dashboard", "referral", "referral.tree"]} />

      <PageHeader message="pages.referral.tree.title"></PageHeader>

      {rows.length > 0 ? (
        <DataGrid
          pagination
          paginationMode="server"
          rowCount={count}
          // paginationModel={{ page: search.skip / search.take, pageSize: search.take }}
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
