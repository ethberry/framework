import { FC } from "react";
import {
  Button,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemSecondaryAction,
  ListItemText,
  Pagination,
} from "@mui/material";
import { FilterList, Visibility } from "@mui/icons-material";
import { FormattedMessage } from "react-intl";

import { Breadcrumbs, PageHeader, ProgressOverlay } from "@gemunion/mui-page-layout";
import { IStake, IStakesSearchDto } from "@framework/types";
import { useCollection } from "@gemunion/react-hooks";

import { StakesSearchForm } from "./form";
import { StakesViewDialog } from "./view";

export const Stakes: FC = () => {
  const {
    rows,
    count,
    search,
    selected,
    isLoading,
    isFiltersOpen,
    handleToggleFilters,
    isViewDialogOpen,
    handleView,
    handleViewConfirm,
    handleViewCancel,
    handleSearch,
    handleChangePage,
  } = useCollection<IStake, IStakesSearchDto>({
    baseUrl: "/stakes",
    search: {
      query: "",
      stakeStatus: [],
    },
    // empty: {
    //   beneficiary: "",
    //   duration: 0,
    //   startTimestamp: new Date().toISOString(),
    // },
  });

  return (
    <Grid>
      <Breadcrumbs path={["dashboard", "erc20-vesting"]} />

      <PageHeader message="pages.erc20-vesting.title">
        <Button startIcon={<FilterList />} onClick={handleToggleFilters} data-testid="ToggleFilterButton">
          <FormattedMessage id={`form.buttons.${isFiltersOpen ? "hideFilters" : "showFilters"}`} />
        </Button>
      </PageHeader>

      <StakesSearchForm onSubmit={handleSearch} initialValues={search} open={isFiltersOpen} />

      <ProgressOverlay isLoading={isLoading}>
        <List>
          {rows.map((stake, i) => (
            <ListItem key={i}>
              <ListItemText>{stake.owner}</ListItemText>
              <ListItemSecondaryAction>
                <IconButton onClick={handleView(stake)}>
                  <Visibility />
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
          ))}
        </List>
      </ProgressOverlay>

      <Pagination
        sx={{ mt: 2 }}
        shape="rounded"
        page={search.skip / search.take + 1}
        count={Math.ceil(count / search.take)}
        onChange={handleChangePage}
      />

      <StakesViewDialog
        onCancel={handleViewCancel}
        onConfirm={handleViewConfirm}
        open={isViewDialogOpen}
        initialValues={selected}
      />
    </Grid>
  );
};
