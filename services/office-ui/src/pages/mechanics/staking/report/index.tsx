import { FC } from "react";
import { Button, Grid } from "@mui/material";
import { CloudDownload, FilterList } from "@mui/icons-material";
import { DataGrid, GridCellParams } from "@mui/x-data-grid";
import { FormattedMessage, useIntl } from "react-intl";
import { addMonths, endOfMonth, format, parseISO, startOfMonth, subMonths } from "date-fns";

import { SelectInput, SwitchInput, TextInput } from "@gemunion/mui-inputs-core";
import { DateTimeInput } from "@gemunion/mui-inputs-picker";
import { CommonSearchForm } from "@gemunion/mui-form-search";
import { Breadcrumbs, PageHeader } from "@gemunion/mui-page-layout";
import { useApiCall, useCollection } from "@gemunion/react-hooks";
import { useUser } from "@gemunion/provider-user";
import { humanReadableDateTimeFormat } from "@gemunion/constants";
import { AddressLink } from "@gemunion/mui-scanner";
import { InputType } from "@gemunion/types-collection";
import type { IStakingDeposit, IStakingReportSearchDto, IUser } from "@framework/types";
import { StakingDepositStatus, TokenType } from "@framework/types";
import { formatItem } from "@framework/exchange";

import { SearchTokenSelectInput } from "../../../../components/inputs/search-token-select";
import { SearchContractInput } from "../../../../components/inputs/search-contract";
import { StakingContractInput } from "../../../../components/inputs/staking-contract";
import { SearchMerchantInput } from "../../../../components/inputs/search-merchant";

export const StakingReport: FC = () => {
  const { profile } = useUser<IUser>();

  const {
    rows,
    count,
    search,
    isLoading,
    isFiltersOpen,
    handleSearch,
    handleToggleFilters,
    handleChangePaginationModel,
  } = useCollection<IStakingDeposit, IStakingReportSearchDto>({
    baseUrl: "/staking/report",
    empty: {
      createdAt: new Date().toISOString(),
    },
    search: {
      account: "",
      stakingDepositStatus: [StakingDepositStatus.ACTIVE],
      deposit: {
        tokenType: TokenType.ERC20,
        contractId: InputType.awaited,
      },
      reward: {
        tokenType: TokenType.ERC721,
        contractId: InputType.awaited,
      },
      emptyReward: false,
      merchantId: profile.merchantId,
      startTimestamp: startOfMonth(subMonths(new Date(), 1)).toISOString(),
      endTimestamp: endOfMonth(addMonths(new Date(), 1)).toISOString(),
    },
  });

  const { formatMessage } = useIntl();

  const { fn } = useApiCall(async (api, values) => {
    return api.fetchFile({
      url: "/staking/report/export",
      data: values,
    });
  });

  const handleExport = (): Promise<void> => {
    return fn(void 0, search);
  };

  // prettier-ignore
  const columns = [
    {
      field: "id",
      headerName: formatMessage({ id: "form.labels.id" }),
      sortable: true,
      flex: 0.3
    },
    {
      field: "account",
      headerName: formatMessage({ id: "form.labels.account" }),
      sortable: true,
      renderCell: (params: GridCellParams<any, string>) => {
        return (
          <AddressLink address={params.value} />
        );
      },
      flex: 2,
      minWidth: 360
    },
    {
      field: "deposit",
      headerName: formatMessage({ id: "form.labels.deposit" }),
      sortable: true,
      flex: 1,
      minWidth: 100
    },
    {
      field: "stakingRule",
      headerName: formatMessage({ id: "form.labels.stakingRule" }),
      sortable: true,
      flex: 1,
      minWidth: 100
    },
    {
      field: "createdAt",
      headerName: formatMessage({ id: "form.labels.createdAt" }),
      sortable: true,
      valueFormatter: ({ value }: { value: string }) => format(parseISO(value), humanReadableDateTimeFormat),
      flex: 1,
      minWidth: 160
    }
  ];

  return (
    <Grid>
      <Breadcrumbs path={["dashboard", "staking", "staking.report"]} />

      <PageHeader message="pages.staking.report.title">
        <Button startIcon={<FilterList />} onClick={handleToggleFilters} data-testid="ToggleFilterButton">
          <FormattedMessage id={`form.buttons.${isFiltersOpen ? "hideFilters" : "showFilters"}`} />
        </Button>
        <Button startIcon={<CloudDownload />} onClick={handleExport}>
          <FormattedMessage id="form.buttons.export" />
        </Button>
      </PageHeader>

      <CommonSearchForm
        onSubmit={handleSearch}
        initialValues={search}
        open={isFiltersOpen}
        testId="StakingReportSearchForm"
      >
        <Grid container spacing={2} alignItems="flex-end">
          <Grid item xs={6}>
            <SearchMerchantInput disableClear />
          </Grid>
          <Grid item xs={6}>
            <StakingContractInput />
          </Grid>
          <Grid item xs={6}>
            <SelectInput name="stakingDepositStatus" options={StakingDepositStatus} multiple />
          </Grid>
          <Grid item xs={6}>
            <TextInput name="account" />
          </Grid>
          <Grid item xs={6} />
          <Grid item xs={6}>
            <SwitchInput name="emptyReward" />
          </Grid>
          <Grid item xs={6}>
            <SearchTokenSelectInput prefix="deposit" />
          </Grid>
          <Grid item xs={6}>
            <SearchTokenSelectInput prefix="reward" />
          </Grid>
          <Grid item xs={6}>
            <SearchContractInput prefix="deposit" />
          </Grid>
          <Grid item xs={6}>
            <SearchContractInput prefix="reward" />
          </Grid>
          <Grid item xs={6}>
            <DateTimeInput name="startTimestamp" />
          </Grid>
          <Grid item xs={6}>
            <DateTimeInput name="endTimestamp" />
          </Grid>
        </Grid>
      </CommonSearchForm>

      <DataGrid
        pagination
        paginationMode="server"
        rowCount={count}
        paginationModel={{ page: search.skip / search.take, pageSize: search.take }}
        onPaginationModelChange={handleChangePaginationModel}
        pageSizeOptions={[5, 10, 25]}
        loading={isLoading}
        columns={columns}
        rows={rows.map((stake: IStakingDeposit) => ({
          id: stake.id,
          account: stake.account,
          deposit: formatItem(stake.stakingRule?.deposit),
          stakingRule: stake.stakingRule?.title,
          createdAt: stake.createdAt,
        }))}
        autoHeight
      />
    </Grid>
  );
};
