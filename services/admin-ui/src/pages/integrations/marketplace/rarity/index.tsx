import { FC, useEffect, useState } from "react";
import { Button, Grid, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import { FilterList } from "@mui/icons-material";
import { FormattedMessage } from "react-intl";
import { useLocation, useNavigate } from "react-router";
import { stringify } from "qs";

import { Breadcrumbs, PageHeader, ProgressOverlay } from "@gemunion/mui-page-layout";
import type { IMarketplaceSupplySearchDto } from "@framework/types";
import { TokenAttributes, TokenRarity } from "@framework/types";
import { useApiCall } from "@gemunion/react-hooks";

import { MarketplaceRaritySearchForm } from "./form";

export const MarketplaceRarity: FC = () => {
  const [isFiltersOpen, setIsFilterOpen] = useState(false);
  const [search, setSearch] = useState<IMarketplaceSupplySearchDto>({
    attribute: TokenAttributes.RARITY,
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
      <Breadcrumbs path={["dashboard", "marketplace", "marketplace.rarity"]} />

      <PageHeader message="pages.marketplace.rarity.title">
        <Button startIcon={<FilterList />} onClick={handleToggleFilters} data-testid="ToggleFilterButton">
          <FormattedMessage
            id={`form.buttons.${isFiltersOpen ? "hideFilters" : "showFilters"}`}
            data-testid="ToggleFiltersButton"
          />
        </Button>
      </PageHeader>

      <MarketplaceRaritySearchForm onSubmit={handleSearch} initialValues={search} open={isFiltersOpen} />

      <ProgressOverlay isLoading={isLoading}>
        <TableContainer component={Paper}>
          <Table aria-label="supply table">
            <TableHead>
              <TableRow>
                <TableCell align="left">
                  <FormattedMessage id="pages.marketplace.rarity.attribute" />
                </TableCell>
                <TableCell align="right">
                  <FormattedMessage id="pages.marketplace.rarity.amount" />
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {Object.values(TokenRarity).map((e, i) => {
                const row = rows.find(e => e.attribute === i);
                return (
                  <TableRow key={i}>
                    <TableCell align="left">
                      <FormattedMessage id={`enums.rarity.${e}`} />
                    </TableCell>
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
