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
import { Erc20VestingTemplate, IErc20Vesting, IErc20VestingSearchDto } from "@framework/types";
import { useCollection } from "@gemunion/react-hooks";
import { Erc20VestingSearchForm } from "./form";
import { Erc20VestingViewDialog } from "./view";
import { Erc20VestingDeployButton } from "../../../components/buttons";

export const Erc20Vesting: FC = () => {
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
    handleSubmit,
    handleChangePage,
  } = useCollection<IErc20Vesting, IErc20VestingSearchDto>({
    baseUrl: "/erc20-vesting",
    search: {
      query: "",
      vestingTemplate: [Erc20VestingTemplate.LINEAR, Erc20VestingTemplate.GRADED, Erc20VestingTemplate.CLIFF],
    },
    empty: {
      beneficiary: "",
      duration: 0,
      startTimestamp: new Date().toISOString(),
    },
  });

  return (
    <Grid>
      <Breadcrumbs path={["dashboard", "erc20-vesting"]} />

      <PageHeader message="pages.erc20-vesting.title">
        <Button startIcon={<FilterList />} onClick={handleToggleFilters}>
          <FormattedMessage id={`form.buttons.${isFiltersOpen ? "hideFilters" : "showFilters"}`} />
        </Button>
        <Erc20VestingDeployButton />
      </PageHeader>

      <Erc20VestingSearchForm onSubmit={handleSubmit} initialValues={search} open={isFiltersOpen} />

      <ProgressOverlay isLoading={isLoading}>
        <List>
          {rows.map((vesting, i) => (
            <ListItem key={i}>
              <ListItemText>{vesting.beneficiary}</ListItemText>
              <ListItemText>{vesting.vestingTemplate}</ListItemText>
              <ListItemSecondaryAction>
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

      <Erc20VestingViewDialog
        onCancel={handleViewCancel}
        onConfirm={handleViewConfirm}
        open={isViewDialogOpen}
        initialValues={selected}
      />
    </Grid>
  );
};
