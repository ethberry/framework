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
import { useUser } from "@gemunion/provider-user";
import { AddressLink } from "@gemunion/mui-scanner";
import { CommonSearchForm } from "@gemunion/mui-form-search";
import { EntityInput } from "@gemunion/mui-inputs-entity";
import type { IContract, IUser, IVestingSearchDto } from "@framework/types";

import { emptyVestingContract } from "../../../../components/common/interfaces";
import { VestingDeployButton } from "../../../../components/buttons";
import { VestingActionsMenu } from "../../../../components/menu/mechanics/vesting";
import { VestingViewDialog } from "./view";

export const VestingContracts: FC = () => {
  const { profile } = useUser<IUser>();

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
  } = useCollection<IContract, IVestingSearchDto>({
    baseUrl: "/vesting/contracts",
    search: {
      account: "",
      merchantId: profile.merchantId,
    },
    empty: emptyVestingContract,
  });

  const { formatMessage } = useIntl();

  return (
    <Grid>
      <Breadcrumbs path={["dashboard", "vesting", "vesting.contracts"]} />

      <PageHeader message="pages.vesting.contracts.title">
        <Button startIcon={<FilterList />} onClick={handleToggleFilters} data-testid="ToggleFilterButton">
          <FormattedMessage id={`form.buttons.${isFiltersOpen ? "hideFilters" : "showFilters"}`} />
        </Button>
        <VestingDeployButton />
      </PageHeader>

      <CommonSearchForm onSubmit={handleSearch} initialValues={search} open={isFiltersOpen} name="account">
        <Grid container spacing={2} alignItems="flex-end">
          <Grid item xs={12}>
            <EntityInput name="merchantId" controller="merchants" disableClear />
          </Grid>
        </Grid>
      </CommonSearchForm>

      <ProgressOverlay isLoading={isLoading}>
        <List sx={{ overflowX: "scroll" }}>
          {rows.map(vesting => (
            <ListItem key={vesting.id} sx={{ flexWrap: "wrap" }}>
              <ListItemText sx={{ width: 0.5 }}>
                <AddressLink address={vesting.parameters.account as string} />
              </ListItemText>
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
                <VestingActionsMenu contract={vesting} />
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
