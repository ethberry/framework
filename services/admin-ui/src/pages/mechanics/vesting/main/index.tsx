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
  Tooltip,
} from "@mui/material";
import { FilterList, Visibility } from "@mui/icons-material";
import { FormattedMessage, useIntl } from "react-intl";

import { Breadcrumbs, PageHeader, ProgressOverlay } from "@gemunion/mui-page-layout";
import { useCollection } from "@gemunion/react-hooks";
import { AddressLink } from "@gemunion/mui-scanner";
import { IVesting, IVestingSearchDto } from "@framework/types";

import { VestingSearchForm } from "./form";
import { VestingViewDialog } from "./view";
import { VestingDeployButton } from "../../../../components/buttons";
import { VestingActionsMenu } from "../../../../components/menu/vesting";
import { emptyContract } from "../../../../components/common/interfaces";

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
      account: "",
      contractTemplate: [],
    },
    empty: {
      account: "",
      duration: 0,
      startTimestamp: new Date().toISOString(),
      contract: emptyContract,
    },
  });

  const { formatMessage } = useIntl();

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
        <List sx={{ overflowX: "scroll" }}>
          {rows.map((vesting, i) => (
            <ListItem key={i} sx={{ flexWrap: "wrap" }}>
              <ListItemText sx={{ width: 0.6 }}>
                <AddressLink address={vesting.account} />
              </ListItemText>{" "}
              <ListItemText sx={{ width: { xs: 0.6, md: 0.2 } }}>{vesting.contractTemplate}</ListItemText>
              <ListItemSecondaryAction
                sx={{
                  top: { xs: "80%", sm: "50%" },
                  transform: { xs: "translateY(-80%)", sm: "translateY(-50%)" },
                }}
              >
                <Tooltip title={formatMessage({ id: "form.tips.view" })}>
                  <IconButton onClick={handleView(vesting)}>
                    <Visibility />
                  </IconButton>
                </Tooltip>
                <VestingActionsMenu vesting={vesting} />
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
