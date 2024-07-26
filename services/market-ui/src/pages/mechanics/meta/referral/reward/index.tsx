import { FC } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import { Button, Grid } from "@mui/material";
import { Redeem } from "@mui/icons-material";
import { DataGrid, GridCellParams } from "@mui/x-data-grid";
import { addMonths, endOfMonth, format, parseISO, startOfMonth, subMonths } from "date-fns";

import { formatItem } from "@framework/exchange";
import { StyledListWrapper } from "@framework/styled";
import type { IReferralEvents, IReferralRewardShare, IReferralReportSearchDto } from "@framework/types";
import { ClaimStatus } from "@framework/types";
import { humanReadableDateTimeFormat } from "@gemunion/constants";
import { AddressLink } from "@gemunion/mui-scanner";
import { Breadcrumbs, PageHeader } from "@gemunion/mui-page-layout";
import { useApiCall } from "@gemunion/react-hooks";
import { useCollection, collectionActions } from "@gemunion/provider-collection";
import { useAppDispatch } from "@gemunion/redux";

export interface IReferralRewardSearchDto extends IReferralReportSearchDto {
  merchantIds: Array<number>;
}

export enum RefClaimStatus {
  NEW = "NEW",
  CREATED = "CREATED",
  CLAIMED = "CLAIMED",
}

export const ReferralReward: FC = () => {
  const { count, rows, search, isLoading, handleChangePaginationModel } = useCollection<
    IReferralEvents,
    IReferralRewardSearchDto
  >({
    baseUrl: "/referral/reward",
    search: {
      // merchantIds: [1, 4], // TODO get list from purchases?
      merchantIds: [], // search by all merchants
      startTimestamp: startOfMonth(subMonths(new Date(), 1)).toISOString(),
      endTimestamp: endOfMonth(addMonths(new Date(), 1)).toISOString(),
    },
  });

  const { formatMessage } = useIntl();

  const dispatch = useAppDispatch();
  const { setNeedRefresh } = collectionActions;

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
      flex: 0.5,
      // minWidth: 100
    },
    {
      field: "account",
      headerName: formatMessage({ id: "form.labels.wallet" }),
      sortable: false,
      renderCell: (params: GridCellParams<any, string>) => {
        return (
          <AddressLink address={params.value} length={16} />
        );
      },
      flex: 1,
      minWidth: 100
    },
    {
      field: "event",
      headerName: formatMessage({ id: "form.labels.event" }),
      sortable: true,
      flex: 0.7,
      minWidth: 100
    },
    {
      field: "item",
      headerName: formatMessage({ id: "form.labels.item" }),
      sortable: true,
      flex: 0.7,
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
      valueFormatter: (value: string) => format(parseISO(value), humanReadableDateTimeFormat),
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
      headerName: formatMessage({ id: "form.labels.claimStatus" }),
      sortable: true,
      flex: 0.7,
      minWidth: 70
    },
  ];

  const { fn: handleClaimApi } = useApiCall(
    api =>
      api.fetchJson({
        url: "/referral/claim/create",
        method: "POST",
      }),
    { success: true, error: true },
  );

  const handleClaim = () => {
    return handleClaimApi(void 0).then(() => {
      void dispatch(setNeedRefresh(true));
    });
  };

  const getClaimStatus = (share: IReferralRewardShare | null) => {
    if (share && share.claim) {
      const { claim } = share;
      switch (claim.claim?.claimStatus) {
        case ClaimStatus.NEW:
          return RefClaimStatus.CREATED;
        case ClaimStatus.REDEEMED:
          return RefClaimStatus.CLAIMED;
        default:
          return RefClaimStatus.CREATED;
      }
    } else {
      return RefClaimStatus.NEW;
    }
  };

  const noRows = !(rows.length > 0);
  const noNewClaims =
    rows
      .filter(row => (row.shares ? row.shares[0] : null))
      .map(row => row.shares)
      .filter(shares => getClaimStatus(shares ? shares[0] : null) === RefClaimStatus.NEW).length === 0;

  const disabledClaim = noRows || noNewClaims;

  return (
    <Grid>
      <Breadcrumbs path={["dashboard", "referral", "referral.reward"]} />

      <PageHeader message="pages.referral.reward.title">
        <Button startIcon={<Redeem />} onClick={handleClaim} disabled={disabledClaim} data-testid="ClaimButton">
          <FormattedMessage id={"form.buttons.claim"} />
        </Button>
      </PageHeader>
      <StyledListWrapper count={rows.length} isLoading={isLoading}>
        <DataGrid
          pagination
          paginationMode="server"
          rowCount={count}
          paginationModel={{ page: search.skip / search.take, pageSize: search.take }}
          onPaginationModelChange={handleChangePaginationModel}
          pageSizeOptions={[5, 10, 25, 100]}
          loading={isLoading}
          columns={columns}
          rows={rows.map((reward: IReferralEvents, idx) => ({
            id: idx,
            merchant: reward.merchant!.title,
            account: reward.account,
            item: formatItem(reward.item),
            price: formatItem(reward.price),
            share: reward.shares ? `${reward.shares[0].share / 100}%` : `0%`,
            createdAt: reward.createdAt,
            event: reward.history!.parent?.eventType,
            claim: getClaimStatus(reward.shares ? reward.shares[0] : null),
          }))}
          autoHeight
        />
      </StyledListWrapper>
    </Grid>
  );
};
