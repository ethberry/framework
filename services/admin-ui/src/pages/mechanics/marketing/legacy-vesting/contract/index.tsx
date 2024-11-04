import { FC } from "react";
import { Grid, ListItemText } from "@mui/material";
import { Visibility } from "@mui/icons-material";
import { useWeb3React } from "@web3-react/core";

import { Breadcrumbs, PageHeader } from "@ethberry/mui-page-layout";
import { SelectInput } from "@ethberry/mui-inputs-core";
import { CollectionActions, useCollection } from "@ethberry/provider-collection";
import { AddressLink } from "@ethberry/mui-scanner";
import { CommonSearchForm } from "@ethberry/mui-form-search";
import { ListAction, ListActions, ListItem, StyledPagination } from "@framework/styled";
import type { IContract, ILegacyVestingContractSearchDto } from "@framework/types";
import { LegacyVestingContractFeatures } from "@framework/types";

import { emptyVestingContract } from "../../../../../components/common/interfaces";
import { TopUpButton, TransferOwnershipButton, LegacyVestingDeployButton } from "../../../../../components/buttons";
import { WithCheckPermissionsListWrapper } from "../../../../../components/wrappers";
import { LegacyVestingViewDialog } from "./view";

export const LegacyVestingContracts: FC = () => {
  const {
    rows,
    count,
    search,
    action,
    selected,
    isLoading,
    handleView,
    handleViewConfirm,
    handleViewCancel,
    handleSearch,
    handleChangePage,
  } = useCollection<IContract, ILegacyVestingContractSearchDto>({
    baseUrl: "/legacy-vesting/contracts",
    search: {
      account: "",
      contractFeatures: [],
    },
    empty: emptyVestingContract,
  });

  const { account = "" } = useWeb3React();

  return (
    <Grid>
      <Breadcrumbs path={["dashboard", "legacy-vesting", "legacy-vesting.contracts"]} />

      <PageHeader message="pages.legacy-vesting.contracts.title">
        <LegacyVestingDeployButton />
      </PageHeader>

      <CommonSearchForm onSubmit={handleSearch} initialValues={search} name="account">
        <Grid container spacing={2} alignItems="flex-end">
          <Grid item xs={12}>
            <SelectInput name="contractFeatures" options={LegacyVestingContractFeatures} multiple />
          </Grid>
        </Grid>
      </CommonSearchForm>

      <WithCheckPermissionsListWrapper isLoading={isLoading} count={rows.length}>
        {rows.map(vesting => (
          <ListItem key={vesting.id} wrap account={account} contract={vesting}>
            <ListItemText sx={{ mr: 0.5, overflowX: "auto", width: 0.5 }}>
              <AddressLink address={vesting.parameters.account as string} />
            </ListItemText>
            <ListActions dataTestId="LegacyVestingActionsMenuButton">
              <ListAction onClick={handleView(vesting)} message="form.tips.view" icon={Visibility} />
              <TopUpButton contract={vesting} />
              <TransferOwnershipButton contract={vesting} />
            </ListActions>
          </ListItem>
        ))}
      </WithCheckPermissionsListWrapper>

      <StyledPagination
        shape="rounded"
        page={search.skip / search.take + 1}
        count={Math.ceil(count / search.take)}
        onChange={handleChangePage}
      />

      <LegacyVestingViewDialog
        onCancel={handleViewCancel}
        onConfirm={handleViewConfirm}
        open={action === CollectionActions.view}
        initialValues={selected}
      />
    </Grid>
  );
};