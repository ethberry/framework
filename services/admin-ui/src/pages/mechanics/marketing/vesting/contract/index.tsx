import { FC } from "react";
import { Grid, ListItemText } from "@mui/material";
import { Visibility } from "@mui/icons-material";
import { useWeb3React } from "@web3-react/core";

import { Breadcrumbs, PageHeader, ProgressOverlay } from "@gemunion/mui-page-layout";
import { SelectInput } from "@gemunion/mui-inputs-core";
import { CollectionActions, useCollection } from "@gemunion/react-hooks";
import { AddressLink } from "@gemunion/mui-scanner";
import { CommonSearchForm } from "@gemunion/mui-form-search";
import {
  ListAction,
  ListActions,
  ListItem,
  ListItemProvider,
  StyledListWrapper,
  StyledPagination,
} from "@framework/styled";
import type { IContract, IVestingSearchDto } from "@framework/types";
import { IAccessControl, TokenType, VestingContractFeatures } from "@framework/types";

import { emptyVestingContract } from "../../../../../components/common/interfaces";
import {
  AllowanceButton,
  TopUpButton,
  TransferOwnershipButton,
  VestingDeployButton,
} from "../../../../../components/buttons";
import { VestingViewDialog } from "./view";
import { useCheckPermissions } from "../../../../../shared";

export const VestingContracts: FC = () => {
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
  } = useCollection<IContract, IVestingSearchDto>({
    baseUrl: "/vesting/contracts",
    search: {
      account: "",
      contractFeatures: [],
    },
    empty: emptyVestingContract,
  });

  const { checkPermissions } = useCheckPermissions();
  const { account = "" } = useWeb3React();

  return (
    <Grid>
      <Breadcrumbs path={["dashboard", "vesting", "vesting.contracts"]} />

      <PageHeader message="pages.vesting.contracts.title">
        <VestingDeployButton />
      </PageHeader>

      <CommonSearchForm onSubmit={handleSearch} initialValues={search} name="account">
        <Grid container spacing={2} alignItems="flex-end">
          <Grid item xs={12}>
            <SelectInput name="contractFeatures" options={VestingContractFeatures} multiple />
          </Grid>
        </Grid>
      </CommonSearchForm>

      <ListItemProvider<IAccessControl> callback={checkPermissions}>
        <ProgressOverlay isLoading={isLoading}>
          <StyledListWrapper count={rows.length} isLoading={isLoading}>
            {rows.map(vesting => (
              <ListItem key={vesting.id} wrap account={account} contract={vesting}>
                <ListItemText sx={{ mr: 0.5, overflowX: "auto", width: 0.5 }}>
                  <AddressLink address={vesting.parameters.account as string} />
                </ListItemText>
                <ListActions dataTestId="VestingActionsMenuButton">
                  <ListAction onClick={handleView(vesting)} message="form.tips.view" icon={Visibility} />
                  <AllowanceButton
                    contract={vesting}
                    disabledTokenTypes={[TokenType.ERC721, TokenType.ERC998, TokenType.ERC1155]}
                  />
                  <TopUpButton contract={vesting} />
                  <TransferOwnershipButton contract={vesting} />
                </ListActions>
              </ListItem>
            ))}
          </StyledListWrapper>
        </ProgressOverlay>
      </ListItemProvider>

      <StyledPagination
        shape="rounded"
        page={search.skip / search.take + 1}
        count={Math.ceil(count / search.take)}
        onChange={handleChangePage}
      />

      <VestingViewDialog
        onCancel={handleViewCancel}
        onConfirm={handleViewConfirm}
        open={action === CollectionActions.view}
        initialValues={selected}
      />
    </Grid>
  );
};
