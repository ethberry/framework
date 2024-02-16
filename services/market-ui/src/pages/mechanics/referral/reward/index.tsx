import { FC } from "react";
import { FormattedMessage, useIntl } from "react-intl";
// import { useNavigate } from "react-router";

import { Button, Grid } from "@mui/material";
import { FilterList, Redeem } from "@mui/icons-material";
import { DataGrid, GridCellParams } from "@mui/x-data-grid";
import { addMonths, endOfMonth, format, parseISO, startOfMonth, subMonths } from "date-fns";

import { AddressLink } from "@gemunion/mui-scanner";
import { Breadcrumbs, PageHeader } from "@gemunion/mui-page-layout";
import { useCollection, useApiCall } from "@gemunion/react-hooks";
import { humanReadableDateTimeFormat } from "@gemunion/constants";

import type { IReferralReportSearchDto } from "@framework/types";
import { IReferralEvents, IReferralRewardShare } from "@framework/types";
import { formatItem } from "@framework/exchange";

export interface IReferralRewardSearchDto extends IReferralReportSearchDto {
  merchantIds: Array<number>;
}

export interface IReferralRewardShareExt extends IReferralEvents {
  shares?: Array<IReferralRewardShare>;
}

export const ReferralReward: FC = () => {
  const {
    count,
    rows,
    // search,
    isLoading,
    isFiltersOpen,
    handleToggleFilters,
    // handleSearch,
    // handleChangePage,
    handleChangePaginationModel,
  } = useCollection<IReferralRewardShareExt, IReferralRewardSearchDto>({
    baseUrl: "/referral/reward",
    search: {
      merchantIds: [1], // TODO get from user.profile?
      startTimestamp: startOfMonth(subMonths(new Date(), 1)).toISOString(),
      endTimestamp: endOfMonth(addMonths(new Date(), 1)).toISOString(),
    },
  });

  const { formatMessage } = useIntl();
  // const navigate = useNavigate();

  // prettier-ignore
  const columns = [
    {
      field: "id",
      headerName: formatMessage({ id: "form.labels.id" }),
      sortable: true,
      flex: 0.05
    },
    {
      field: "account",
      headerName: formatMessage({ id: "form.labels.wallet" }),
      sortable: false,
      renderCell: (params: GridCellParams<any, string>) => {
        return (
          <AddressLink address={params.value} length={22} />
        );
      },
      flex: 1.5,
      minWidth: 150
    },
    {
      field: "event",
      headerName: formatMessage({ id: "form.labels.event" }),
      sortable: true,
      flex: 1,
      minWidth: 100
    },
    {
      field: "item",
      headerName: formatMessage({ id: "form.labels.item" }),
      sortable: true,
      flex: 0.8,
      minWidth: 100
    },
    {
      field: "price",
      headerName: formatMessage({ id: "form.labels.price" }),
      sortable: true,
      flex: 0.8,
      minWidth: 100
    },
    {
      field: "createdAt",
      headerName: formatMessage({ id: "form.labels.createdAt" }),
      sortable: true,
      valueFormatter: ({ value }: { value: string }) => format(parseISO(value), humanReadableDateTimeFormat),
      flex: 1,
      minWidth: 140
    },
    {
      field: "share",
      headerName: formatMessage({ id: "form.labels.share" }),
      sortable: true,
      flex: 0.5,
      minWidth: 50
    },
    {
      field: "claim",
      headerName: formatMessage({ id: "form.labels.claimed" }),
      sortable: true,
      flex: 0.5,
      minWidth: 50
    },
  ];

  // console.log("ReferralRewards", rows, count, search);

  const { fn: handleClaimApi } = useApiCall(
    api =>
      api.fetchJson({
        url: "/referral/claim/create",
        method: "POST",
      }),
    { success: true, error: true },
  );

  const handleClaim = () => {
    return handleClaimApi(void 0).then((json: any) => {
      console.info(json);
      // TODO navigate to /claim or show message?
      // navigate("/claim");
    });
  };

  return (
    <Grid>
      <Breadcrumbs path={["dashboard", "referral", "referral.reward"]} />

      <PageHeader message="pages.referral.reward.title">
        <Button startIcon={<FilterList />} onClick={handleToggleFilters} data-testid="ToggleFilterButton">
          <FormattedMessage id={`form.buttons.${isFiltersOpen ? "hideFilters" : "showFilters"}`} />
        </Button>
        <Button startIcon={<Redeem />} onClick={handleClaim} data-testid="ClaimButton">
          <FormattedMessage id={"form.buttons.claim"} />
        </Button>
      </PageHeader>
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
          rows={rows.map((reward: IReferralRewardShareExt, idx) => ({
            id: idx,
            account: reward.account,
            item: formatItem(reward.item),
            price: formatItem(reward.price),
            share: reward.shares ? `${reward.shares[0].share / 100}%` : `0%`,
            createdAt: reward.createdAt,
            event: reward.history!.parent?.eventType,
            claim: !!(reward.shares && reward.shares[0].claimId),
          }))}
          autoHeight
        />
      ) : null}
    </Grid>
  );
};
