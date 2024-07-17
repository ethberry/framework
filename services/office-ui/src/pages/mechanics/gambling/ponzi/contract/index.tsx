import { FC } from "react";
import { FormattedMessage } from "react-intl";
import { Button, Grid, ListItemText } from "@mui/material";
import { Create, Delete, FilterList } from "@mui/icons-material";
import { useWeb3React } from "@web3-react/core";

import { emptyStateString } from "@gemunion/draft-js-utils";
import { Breadcrumbs, PageHeader, ProgressOverlay } from "@gemunion/mui-page-layout";
import { DeleteDialog } from "@gemunion/mui-dialog-delete";
import { CollectionActions, useCollection } from "@gemunion/react-hooks";
import { useUser } from "@gemunion/provider-user";
import {
  ListAction,
  ListActions,
  ListItem,
  ListItemProvider,
  StyledListWrapper,
  StyledPagination,
} from "@framework/styled";
import type { IContract, IContractSearchDto, IUser } from "@framework/types";
import { ContractStatus, IAccessControl, PonziContractFeatures } from "@framework/types";

import { ContractSearchForm } from "../../../../../components/forms/contract-search";
import {
  AllowanceButton,
  EthListenerAddButton,
  EthListenerRemoveButton,
  GrantRoleButton,
  PonziBalanceButton,
  PonziContractDeployButton,
  RenounceRoleButton,
  RevokeRoleButton,
  TopUpButton,
} from "../../../../../components/buttons";
import { PonziContractEditDialog } from "./edit";

export const PonziContract: FC = () => {
  const { profile } = useUser<IUser>();

  const {
    rows,
    count,
    search,
    action,
    selected,
    isLoading,
    isFiltersOpen,
    handleToggleFilters,
    handleEdit,
    handleEditCancel,
    handleEditConfirm,
    handleDelete,
    handleDeleteCancel,
    handleSearch,
    handleChangePage,
    handleDeleteConfirm,
  } = useCollection<IContract, IContractSearchDto>({
    baseUrl: "/ponzi/contracts",
    empty: {
      title: "",
      description: emptyStateString,
      merchantId: profile.merchantId,
    },
    search: {
      query: "",
      contractStatus: [ContractStatus.ACTIVE, ContractStatus.NEW],
      contractFeatures: [],
      merchantId: profile.merchantId,
    },
    filter: ({ title, description, imageUrl, merchantId, contractStatus }) => ({
      title,
      description,
      imageUrl,
      merchantId,
      contractStatus,
    }),
  });

  const { checkPermissions } = useCheckPermissions();
  const { account = "" } = useWeb3React();

  return (
    <Grid>
      <Breadcrumbs path={["dashboard", "ponzi", "ponzi.contracts"]} />

      <PageHeader message="pages.ponzi.title">
        <Button startIcon={<FilterList />} onClick={handleToggleFilters} data-testid="ToggleFilterButton">
          <FormattedMessage id={`form.buttons.${isFiltersOpen ? "hideFilters" : "showFilters"}`} />
        </Button>
        <PonziContractDeployButton />
      </PageHeader>

      <ContractSearchForm
        onSubmit={handleSearch}
        initialValues={search}
        open={isFiltersOpen}
        contractFeaturesOptions={PonziContractFeatures}
      />

      <ListItemProvider<IAccessControl> callback={checkPermissions}>
        <ProgressOverlay isLoading={isLoading}>
          <StyledListWrapper count={rows.length} isLoading={isLoading}>
            {rows.map(contract => {
              return (
                <ListItem key={contract.id} account={account} contract={contract}>
                  <ListItemText sx={{ width: 0.6 }}>{contract.title}</ListItemText>
                  <ListActions dataTestId="PonziActionsMenuButton">
                    <ListAction
                      onClick={handleEdit(contract)}
                      message="form.buttons.edit"
                      dataTestId="ContractEditButton"
                      icon={Create}
                    />
                    <ListAction
                      onClick={handleDelete(contract)}
                      message="form.buttons.delete"
                      dataTestId="ContractDeleteButton"
                      icon={Delete}
                    />
                    <GrantRoleButton contract={contract} />
                    <RevokeRoleButton contract={contract} />
                    <RenounceRoleButton contract={contract} />
                    <AllowanceButton contract={contract} />
                    <TopUpButton contract={contract} />
                    <PonziBalanceButton contract={contract} />
                    <EthListenerAddButton contract={contract} />
                    <EthListenerRemoveButton contract={contract} />
                  </ListActions>
                </ListItem>
              );
            })}
          </StyledListWrapper>
        </ProgressOverlay>
      </ListItemProvider>

      <StyledPagination
        shape="rounded"
        page={search.skip / search.take + 1}
        count={Math.ceil(count / search.take)}
        onChange={handleChangePage}
      />

      <DeleteDialog
        onCancel={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        open={action === CollectionActions.delete}
        initialValues={selected}
      />

      <PonziContractEditDialog
        onCancel={handleEditCancel}
        onConfirm={handleEditConfirm}
        open={action === CollectionActions.edit}
        initialValues={selected}
      />
    </Grid>
  );
};
