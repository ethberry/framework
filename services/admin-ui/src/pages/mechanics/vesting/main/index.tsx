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
import { IVesting, IVestingSearchDto } from "@framework/types";
import { useCollection } from "@gemunion/react-hooks";

import { VestingSearchForm } from "./form";
import { VestingViewDialog } from "./view";
import { VestingDeployButton } from "../../../../components/buttons";
import { VestingTopUpButton } from "../../../../components/buttons/mechanics/vesting-topup";

export const Vesting: FC = () => {
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
  } = useCollection<IVesting, IVestingSearchDto>({
    baseUrl: "/vesting",
    search: {
      query: "",
      contractTemplate: [],
    },
    empty: {
      account: "",
      duration: 0,
      startTimestamp: new Date().toISOString(),
    },
  });

  return (
    <Grid>
      <Breadcrumbs path={["dashboard", "vesting"]} />

      <PageHeader message="pages.vesting.title">
        <Button startIcon={<FilterList />} onClick={handleToggleFilters} data-testid="ToggleFilterButton">
          <FormattedMessage id={`form.buttons.${isFiltersOpen ? "hideFilters" : "showFilters"}`} />
        </Button>
        <VestingDeployButton />
      </PageHeader>

      <VestingSearchForm onSubmit={handleSearch} initialValues={search} open={isFiltersOpen} />

      <ProgressOverlay isLoading={isLoading}>
        <List>
          {rows.map((vesting, i) => (
            <ListItem key={i}>
              <ListItemText sx={{ width: 0.6 }}>{vesting.account}</ListItemText>
              <ListItemText>{vesting.contractTemplate}</ListItemText>
              <ListItemSecondaryAction>
                <VestingTopUpButton vesting={vesting} />
                <IconButton onClick={handleView(vesting)}>
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

      <VestingViewDialog
        onCancel={handleViewCancel}
        onConfirm={handleViewConfirm}
        open={isViewDialogOpen}
        initialValues={selected}
      />
    </Grid>
  );
};
