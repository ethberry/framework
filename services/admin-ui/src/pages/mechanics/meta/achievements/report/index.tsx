import { FC } from "react";
import { Button, Grid } from "@mui/material";
import { CloudDownload, FilterList } from "@mui/icons-material";
import { DataGrid, GridCellParams } from "@mui/x-data-grid";
import { FormattedMessage, useIntl } from "react-intl";
import { addMonths, endOfMonth, format, parseISO, startOfMonth, subMonths } from "date-fns";

import { Breadcrumbs, PageHeader } from "@ethberry/mui-page-layout";
import { DateTimeInput } from "@ethberry/mui-inputs-picker";
import { CommonSearchForm } from "@ethberry/mui-form-search";
import { useApiCall } from "@ethberry/react-hooks";
import { useCollection } from "@ethberry/provider-collection";
import { humanReadableDateTimeFormat } from "@ethberry/constants";
import { AddressLink } from "@ethberry/mui-scanner";
import type { IAchievementItem, IAchievementsReportSearchDto } from "@framework/types";

export const AchievementReport: FC = () => {
  const {
    rows,
    count,
    search,
    isLoading,
    isFiltersOpen,
    handleSearch,
    handleToggleFilters,
    handleChangePaginationModel,
  } = useCollection<IAchievementItem, IAchievementsReportSearchDto>({
    baseUrl: "/achievements/report",
    search: {
      account: "",
      startTimestamp: startOfMonth(subMonths(new Date(), 1)).toISOString(),
      endTimestamp: endOfMonth(addMonths(new Date(), 1)).toISOString(),
    },
  });

  const { formatMessage } = useIntl();

  const { fn } = useApiCall(async (api, values) => {
    return api.fetchFile({
      url: "/achievements/report/export",
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
      field: "title",
      headerName: formatMessage({ id: "form.labels.title" }),
      sortable: true,
      flex: 1,
      minWidth: 80
    },
    {
      field: "createdAt",
      headerName: formatMessage({ id: "form.labels.createdAt" }),
      sortable: true,
      valueFormatter: (value: string) => format(parseISO(value), humanReadableDateTimeFormat),
      flex: 1,
      minWidth: 160
    }
  ];

  return (
    <Grid>
      <Breadcrumbs path={["dashboard", "achievements", "achievements.report"]} />

      <PageHeader message="pages.achievements.report.title">
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
        name="account"
        testId="StakingReportSearchForm"
      >
        <Grid container spacing={2} alignItems="flex-end">
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
        rows={rows.map((item: IAchievementItem) => ({
          id: item.id,
          account: item.user.wallet,
          title: item.achievementRule.title,
          createdAt: item.createdAt,
        }))}
        autoHeight
      />
    </Grid>
  );
};
