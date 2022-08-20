import { FC } from "react";
import { Button, Grid } from "@mui/material";
import { CloudDownload, FilterList } from "@mui/icons-material";
import { DataGrid } from "@mui/x-data-grid";
import { FormattedMessage, useIntl } from "react-intl";
import { endOfMonth, format, parseISO, startOfMonth } from "date-fns";

import { Breadcrumbs, PageHeader } from "@gemunion/mui-page-layout";
import { IReferralReportSearchDto, IReferralReward } from "@framework/types";
import { useApiCall, useCollection } from "@gemunion/react-hooks";
import { humanReadableDateTimeFormat } from "@gemunion/constants";

import { formatEther } from "../../../../utils/money";
import { ReferralReportSearchForm } from "./form";

export const ReferralReport: FC = () => {
  const {
    rows,
    count,
    search,
    isLoading,
    isFiltersOpen,
    handleSearch,
    handleToggleFilters,
    handleChangePage,
    handleChangeRowsPerPage,
  } = useCollection<IReferralReward, IReferralReportSearchDto>({
    baseUrl: "/referral/report",
    empty: {
      createdAt: new Date().toISOString(),
    },
    search: {
      query: "",
      startTimestamp: startOfMonth(new Date()).toISOString(),
      endTimestamp: endOfMonth(new Date()).toISOString(),
    },
  });

  const { formatMessage } = useIntl();

  const { fn } = useApiCall(async (api, values) => {
    return api.fetchFile({
      url: "/referral/export",
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
      flex: 0
    },
    {
      field: "referrer",
      headerName: formatMessage({ id: "form.labels.referrer" }),
      sortable: false,
      flex: 1
    },
    {
      field: "createdAt",
      headerName: formatMessage({ id: "form.labels.createdAt" }),
      sortable: true,
      valueFormatter: ({ value }: { value: string }) => format(parseISO(value), humanReadableDateTimeFormat),
      flex: 1
    },
    {
      field: "amount",
      headerName: formatMessage({ id: "form.labels.amount" }),
      sortable: true,
      valueFormatter: ({ value }: { value: string }) => formatEther(value),
      flex: 1
    }
  ];

  return (
    <Grid>
      <Breadcrumbs path={["dashboard", "referral", "referral.report"]} />

      <PageHeader message="pages.referral.report.title">
        <Button startIcon={<FilterList />} onClick={handleToggleFilters} data-testid="ToggleFilterButton">
          <FormattedMessage
            id={`form.buttons.${isFiltersOpen ? "hideFilters" : "showFilters"}`}
            data-testid="ToggleFiltersButton"
          />
        </Button>
        <Button startIcon={<CloudDownload />} onClick={handleExport}>
          <FormattedMessage id="form.buttons.export" />
        </Button>
      </PageHeader>

      <ReferralReportSearchForm onSubmit={handleSearch} initialValues={search} open={isFiltersOpen} />

      <DataGrid
        pagination
        paginationMode="server"
        rowCount={count}
        pageSize={search.take}
        onPageChange={page => handleChangePage(null as any, page)}
        onPageSizeChange={handleChangeRowsPerPage}
        rowsPerPageOptions={[5, 10, 25]}
        loading={isLoading}
        columns={columns}
        rows={rows.map((reward: IReferralReward) => ({
          id: reward.id,
          referrer: reward.referrer,
          createdAt: reward.createdAt,
          amount: reward.amount,
        }))}
        autoHeight
      />
    </Grid>
  );
};
