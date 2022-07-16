import { FC, Fragment } from "react";
import { FormattedMessage } from "react-intl";
import { Button, Grid, Pagination } from "@mui/material";
import { useParams } from "react-router";
import { FilterList } from "@mui/icons-material";
import { constants } from "ethers";

import { Breadcrumbs, PageHeader, ProgressOverlay } from "@gemunion/mui-page-layout";
import { ILootbox, ILootboxSearchDto, LootboxStatus } from "@framework/types";
import { useCollection } from "@gemunion/react-hooks";

import { LootboxItem } from "./item";
import { LootboxSearchForm } from "./form";

export interface ILootboxListProps {
  embedded?: boolean;
}

export const LootboxList: FC<ILootboxListProps> = props => {
  const { embedded } = props;

  const { id = "" } = useParams<{ id: string }>();

  const { rows, count, search, isLoading, isFiltersOpen, handleToggleFilters, handleSearch, handleChangePage } =
    useCollection<ILootbox, ILootboxSearchDto>({
      baseUrl: "/lootboxes",
      embedded,
      search: {
        query: "",
        contractIds: id ? [~~id] : [],
        lootboxStatus: [LootboxStatus.ACTIVE],
        minPrice: constants.Zero.toString(),
        maxPrice: constants.WeiPerEther.toString(),
      },
    });

  return (
    <Fragment>
      <Breadcrumbs path={["dashboard", "lootboxes"]} isHidden={embedded} />

      <PageHeader message="pages.lootboxes.title">
        <Button startIcon={<FilterList />} onClick={handleToggleFilters} data-testid="ToggleFilterButton">
          <FormattedMessage
            id={`form.buttons.${isFiltersOpen ? "hideFilters" : "showFilters"}`}
            data-testid="ToggleFiltersButton"
          />
        </Button>
      </PageHeader>

      <LootboxSearchForm onSubmit={handleSearch} initialValues={search} open={isFiltersOpen} embedded={embedded} />

      <ProgressOverlay isLoading={isLoading}>
        <Grid container spacing={2}>
          {rows.map(lootbox => (
            <Grid item lg={4} sm={6} xs={12} key={lootbox.id}>
              <LootboxItem lootbox={lootbox} />
            </Grid>
          ))}
        </Grid>
      </ProgressOverlay>

      <Pagination
        sx={{ mt: 2 }}
        shape="rounded"
        page={search.skip / search.take + 1}
        count={Math.ceil(count / search.take)}
        onChange={handleChangePage}
      />
    </Fragment>
  );
};
