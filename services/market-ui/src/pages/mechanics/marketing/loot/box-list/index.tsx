import { FC, Fragment } from "react";
import { FormattedMessage } from "react-intl";
import { Button, Grid } from "@mui/material";
import { FilterList } from "@mui/icons-material";
import { constants } from "ethers";
import { useParams } from "react-router";

import { Breadcrumbs, PageHeader, ProgressOverlay } from "@ethberry/mui-page-layout";
import { useCollection } from "@ethberry/provider-collection";
import { StyledEmptyWrapper, StyledPagination } from "@framework/styled";
import type { ILootBox, ILootBoxSearchDto } from "@framework/types";

import { LootBoxListItem } from "./item";
import { LootBoxSearchForm } from "./form";

export interface ILootboxListProps {
  embedded?: boolean;
}

export const LootBoxList: FC<ILootboxListProps> = props => {
  const { embedded } = props;

  const { id } = useParams<{ id: string }>();

  const { rows, count, search, isLoading, isFiltersOpen, handleToggleFilters, handleSearch, handleChangePage } =
    useCollection<ILootBox, ILootBoxSearchDto>({
      baseUrl: "/loot/boxes",
      embedded,
      search: {
        query: "",
        contractIds: embedded ? [~~id!] : [],
        minPrice: constants.Zero.toString(),
        maxPrice: constants.WeiPerEther.mul(1000).toString(),
      },
    });

  return (
    <Fragment>
      <Breadcrumbs path={["dashboard", "loot", "loot.boxes"]} isHidden={embedded} />

      <PageHeader message="pages.loot.boxes.title">
        <Button startIcon={<FilterList />} onClick={handleToggleFilters} data-testid="ToggleFilterButton">
          <FormattedMessage id={`form.buttons.${isFiltersOpen ? "hideFilters" : "showFilters"}`} />
        </Button>
      </PageHeader>

      <LootBoxSearchForm onSubmit={handleSearch} initialValues={search} open={isFiltersOpen} embedded={embedded} />

      <ProgressOverlay isLoading={isLoading}>
        <Grid container spacing={2}>
          <StyledEmptyWrapper count={rows.length} isLoading={isLoading}>
            {rows.map(lootbox => (
              <Grid item lg={4} sm={6} xs={12} key={lootbox.id}>
                <LootBoxListItem lootBox={lootbox} />
              </Grid>
            ))}
          </StyledEmptyWrapper>
        </Grid>
      </ProgressOverlay>

      <StyledPagination
        shape="rounded"
        page={search.skip / search.take + 1}
        count={Math.ceil(count / search.take)}
        onChange={handleChangePage}
      />
    </Fragment>
  );
};
