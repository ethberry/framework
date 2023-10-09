import { FC, Fragment } from "react";
import { FormattedMessage } from "react-intl";
import { Button, Grid } from "@mui/material";
import { FilterList } from "@mui/icons-material";
import { constants } from "ethers";
import { useParams } from "react-router";

import { Breadcrumbs, PageHeader, ProgressOverlay } from "@gemunion/mui-page-layout";
import { useCollection } from "@gemunion/react-hooks";
import { StyledPagination } from "@framework/styled";
import type { IMysteryBox, IMysteryBoxSearchDto } from "@framework/types";

import { MysteryBoxListItem } from "./item";
import { MysteryBoxSearchForm } from "./form";

export interface IMysteryboxListProps {
  embedded?: boolean;
}

export const MysteryBoxList: FC<IMysteryboxListProps> = props => {
  const { embedded } = props;

  const { id } = useParams<{ id: string }>();

  const { rows, count, search, isLoading, isFiltersOpen, handleToggleFilters, handleSearch, handleChangePage } =
    useCollection<IMysteryBox, IMysteryBoxSearchDto>({
      baseUrl: "/mystery/boxes",
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
      <Breadcrumbs path={["dashboard", "mystery", "mystery.boxes"]} isHidden={embedded} />

      <PageHeader message="pages.mystery.boxes.title">
        <Button startIcon={<FilterList />} onClick={handleToggleFilters} data-testid="ToggleFilterButton">
          <FormattedMessage id={`form.buttons.${isFiltersOpen ? "hideFilters" : "showFilters"}`} />
        </Button>
      </PageHeader>

      <MysteryBoxSearchForm onSubmit={handleSearch} initialValues={search} open={isFiltersOpen} embedded={embedded} />

      <ProgressOverlay isLoading={isLoading}>
        <Grid container spacing={2}>
          {rows.map(mysterybox => (
            <Grid item lg={4} sm={6} xs={12} key={mysterybox.id}>
              <MysteryBoxListItem mysteryBox={mysterybox} />
            </Grid>
          ))}
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
