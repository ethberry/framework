import { FC, useEffect, useState } from "react";
import { Button, Grid, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import { FilterList } from "@mui/icons-material";
import { FormattedMessage } from "react-intl";
import { useLocation, useNavigate } from "react-router";
import { stringify } from "qs";

import { Breadcrumbs, PageHeader, ProgressOverlay } from "@gemunion/mui-page-layout";
import type { IMarketplaceSupplySearchDto } from "@framework/types";
import { TokenAttributes } from "@framework/types";
import { useApiCall } from "@gemunion/react-hooks";

import { MarketplaceGradeSearchForm } from "./form";

export const MarketplaceGrade: FC = () => {
  const [isFiltersOpen, setIsFilterOpen] = useState(false);
  const [search, setSearch] = useState<IMarketplaceSupplySearchDto>({
    attribute: TokenAttributes.GRADE,
    contractIds: [] as Array<number>,
    templateIds: [] as Array<number>,
  });
  const [rows, setRows] = useState<Array<any>>([]);
  const navigate = useNavigate();
  const location = useLocation();

  const { fn, isLoading } = useApiCall(
    (api, values) => {
      return api.fetchJson({
        url: `/marketplace/report/supply`,
        data: values,
      });
    },
    { success: false },
  );

  const handleToggleFilters = () => {
    setIsFilterOpen(!isFiltersOpen);
  };

  const handleSearch = (values: IMarketplaceSupplySearchDto): Promise<void> => {
    setSearch(values);

    // to promisify searching for the form onSubmit function
    return Promise.resolve();
  };

  useEffect(() => {
    void fn(null as unknown as any, search).then((json: any) => {
      setRows(json.rows);
    });
    const { attribute: _attribute, ...rest } = search;
    navigate(`${location.pathname}?${stringify(rest)}`);
  }, [search]);

  return (
    <Grid>
      <Breadcrumbs path={["dashboard", "marketplace", "marketplace.grade"]} />

      <PageHeader message="pages.marketplace.grade.title">
        <Button startIcon={<FilterList />} onClick={handleToggleFilters} data-testid="ToggleFilterButton">
          <FormattedMessage
            id={`form.buttons.${isFiltersOpen ? "hideFilters" : "showFilters"}`}
            data-testid="ToggleFiltersButton"
          />
        </Button>
      </PageHeader>

      <MarketplaceGradeSearchForm onSubmit={handleSearch} initialValues={search} open={isFiltersOpen} />

      <ProgressOverlay isLoading={isLoading}>
        <TableContainer component={Paper}>
          <Table aria-label="supply table">
            <TableHead>
              <TableRow>
                <TableCell align="left">
                  <FormattedMessage id="pages.marketplace.grade.attribute" />
                </TableCell>
                <TableCell align="right">
                  <FormattedMessage id="pages.marketplace.grade.amount" />
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {new Array(10).fill(null).map((e, i) => {
                const row = rows.find(e => e.attribute === i + 1);
                return (
                  <TableRow key={i}>
                    <TableCell align="left">{i + 1}</TableCell>
                    <TableCell align="right">{row?.count ?? 0}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </ProgressOverlay>
    </Grid>
  );
};
