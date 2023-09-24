import { FC } from "react";
import { FormattedMessage } from "react-intl";
import { Button, Grid, List, ListItem, ListItemText } from "@mui/material";
import { Create, Delete, FilterList } from "@mui/icons-material";

import { emptyStateString } from "@gemunion/draft-js-utils";
import { Breadcrumbs, PageHeader, ProgressOverlay } from "@gemunion/mui-page-layout";
import { DeleteDialog } from "@gemunion/mui-dialog-delete";
import { useCollection } from "@gemunion/react-hooks";
import { useUser } from "@gemunion/provider-user";
import { ListAction, ListActions } from "@framework/mui-lists";
import { StyledPagination } from "@framework/styled";
import type { IContract, IContractSearchDto, IUser } from "@framework/types";
import { ContractStatus, PonziContractFeatures } from "@framework/types";

import { ContractSearchForm } from "../../../../components/forms/contract-search";
import { PonziDeployButton } from "../../../../components/buttons";
import { GrantRoleButton } from "../../../../components/buttons/extensions/grant-role";
import { RevokeRoleButton } from "../../../../components/buttons/extensions/revoke-role";
import { RenounceRoleButton } from "../../../../components/buttons/extensions/renounce-role";
import { AllowanceButton } from "../../../../components/buttons/mechanics/common/allowance";
import { TopUpButton } from "../../../../components/buttons/mechanics/common/top-up";
import { PonziBalanceButton } from "../../../../components/buttons/mechanics/ponzi/ponzi-balances";
import { EthListenerAddButton } from "../../../../components/buttons/common/eth-add";
import { EthListenerRemoveButton } from "../../../../components/buttons/common/eth-remove";
import { PonziContractEditDialog } from "./edit";

export const PonziContract: FC = () => {
  const { profile } = useUser<IUser>();

  const {
    rows,
    count,
    search,
    selected,
    isLoading,
    isFiltersOpen,
    isEditDialogOpen,
    isDeleteDialogOpen,
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

  return (
    <Grid>
      <Breadcrumbs path={["dashboard", "ponzi", "ponzi.contracts"]} />

      <PageHeader message="pages.ponzi.title">
        <Button startIcon={<FilterList />} onClick={handleToggleFilters} data-testid="ToggleFilterButton">
          <FormattedMessage
            id={`form.buttons.${isFiltersOpen ? "hideFilters" : "showFilters"}`}
            data-testid="ToggleFiltersButton"
          />
        </Button>
        <PonziDeployButton />
      </PageHeader>

      <ContractSearchForm
        onSubmit={handleSearch}
        initialValues={search}
        open={isFiltersOpen}
        contractFeaturesOptions={PonziContractFeatures}
      />

      <ProgressOverlay isLoading={isLoading}>
        <List>
          {rows.map(contract => (
            <ListItem key={contract.id}>
              <ListItemText sx={{ width: 0.6 }}>{contract.title}</ListItemText>
              <ListActions dataTestId="PonziActionsMenuButton">
                <ListAction onClick={handleEdit(contract)} icon={Create} message="form.buttons.edit" />
                <ListAction
                  onClick={handleDelete(contract)}
                  icon={Delete}
                  message="form.buttons.delete"
                  disabled={contract.contractStatus === ContractStatus.INACTIVE}
                />
                <GrantRoleButton contract={contract} disabled={contract.contractStatus === ContractStatus.INACTIVE} />
                <RevokeRoleButton contract={contract} disabled={contract.contractStatus === ContractStatus.INACTIVE} />
                <RenounceRoleButton
                  contract={contract}
                  disabled={contract.contractStatus === ContractStatus.INACTIVE}
                />
                <AllowanceButton contract={contract} disabled={contract.contractStatus === ContractStatus.INACTIVE} />
                <TopUpButton contract={contract} disabled={contract.contractStatus === ContractStatus.INACTIVE} />
                <PonziBalanceButton
                  contract={contract}
                  disabled={contract.contractStatus === ContractStatus.INACTIVE}
                />
                <EthListenerAddButton
                  contract={contract}
                  disabled={contract.contractStatus === ContractStatus.INACTIVE}
                />
                <EthListenerRemoveButton
                  contract={contract}
                  disabled={contract.contractStatus === ContractStatus.INACTIVE}
                />
              </ListActions>
            </ListItem>
          ))}
        </List>
      </ProgressOverlay>

      <StyledPagination
        shape="rounded"
        page={search.skip / search.take + 1}
        count={Math.ceil(count / search.take)}
        onChange={handleChangePage}
      />

      <DeleteDialog
        onCancel={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        open={isDeleteDialogOpen}
        initialValues={selected}
      />

      <PonziContractEditDialog
        onCancel={handleEditCancel}
        onConfirm={handleEditConfirm}
        open={isEditDialogOpen}
        initialValues={selected}
      />
    </Grid>
  );
};
