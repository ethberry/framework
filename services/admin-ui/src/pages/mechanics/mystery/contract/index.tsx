import { FC } from "react";
import { FormattedMessage } from "react-intl";
import { Button, Grid, List, ListItem, ListItemText, Pagination } from "@mui/material";
import { Create, Delete, FilterList } from "@mui/icons-material";

import { Breadcrumbs, PageHeader, ProgressOverlay } from "@gemunion/mui-page-layout";
import { DeleteDialog } from "@gemunion/mui-dialog-delete";
import { useCollection } from "@gemunion/react-hooks";
import { emptyStateString } from "@gemunion/draft-js-utils";
import {
  ContractFeatures,
  ContractStatus,
  IContract,
  IContractSearchDto,
  MysteryContractFeatures,
} from "@framework/types";

import { MysteryContractDeployButton } from "../../../../components/buttons";
import { ContractSearchForm } from "../../../../components/forms/contract-search";
import { ListAction, ListActions } from "../../../../components/common/lists";
import { GrantRoleMenuItem } from "../../../../components/menu/extensions/grant-role";
import { RevokeRoleMenuItem } from "../../../../components/menu/extensions/revoke-role";
import { RenounceRoleMenuItem } from "../../../../components/menu/extensions/renounce-role";
import { BlacklistMenuItem } from "../../../../components/menu/extensions/blacklist-add";
import { UnBlacklistMenuItem } from "../../../../components/menu/extensions/blacklist-remove";
import { WhitelistMenuItem } from "../../../../components/menu/extensions/whitelist-add";
import { UnWhitelistMenuItem } from "../../../../components/menu/extensions/whitelist-remove";
import { PauseMenuItem } from "../../../../components/menu/mechanics/common/pause";
import { UnPauseMenuItem } from "../../../../components/menu/mechanics/common/unpause";
import { MintMenuItem } from "../../../../components/menu/mechanics/mystery/contract/mint";
import { AllowanceMenuItem } from "../../../../components/menu/hierarchy/contract/allowance";
import { RoyaltyMenuItem } from "../../../../components/menu/common/royalty";
import { TransferMenuItem } from "../../../../components/menu/common/transfer";
import { MysteryContractEditDialog } from "./edit";

export const MysteryContract: FC = () => {
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
    handleDeleteConfirm,
    handleSearch,
    handleChangePage,
    handleRefreshPage,
  } = useCollection<IContract, IContractSearchDto>({
    baseUrl: "/mystery/contracts",
    empty: {
      title: "",
      description: emptyStateString,
      contractStatus: ContractStatus.NEW,
    },
    search: {
      query: "",
      contractStatus: [ContractStatus.ACTIVE, ContractStatus.NEW],
      contractFeatures: [],
    },
    filter: ({ title, description, imageUrl, contractStatus }) => ({
      title,
      description,
      imageUrl,
      contractStatus,
    }),
  });
  return (
    <Grid>
      <Breadcrumbs path={["dashboard", "mystery", "mystery.contracts"]} />

      <PageHeader message="pages.mystery.contracts.title">
        <Button startIcon={<FilterList />} onClick={handleToggleFilters} data-testid="ToggleFilterButton">
          <FormattedMessage
            id={`form.buttons.${isFiltersOpen ? "hideFilters" : "showFilters"}`}
            data-testid="ToggleFiltersButton"
          />
        </Button>
        <MysteryContractDeployButton />
      </PageHeader>

      <ContractSearchForm
        onSubmit={handleSearch}
        initialValues={search}
        open={isFiltersOpen}
        contractFeaturesOptions={MysteryContractFeatures}
        onRefreshPage={handleRefreshPage}
      />

      <ProgressOverlay isLoading={isLoading}>
        <List>
          {rows.map(contract => (
            <ListItem key={contract.id}>
              <ListItemText>{contract.title}</ListItemText>
              <ListActions dataTestId="MysteryActionsMenuButton">
                <ListAction onClick={handleEdit(contract)} icon={Create} message="form.buttons.edit" />
                <ListAction
                  onClick={handleDelete(contract)}
                  icon={Delete}
                  message="form.buttons.delete"
                  disabled={contract.contractStatus === ContractStatus.INACTIVE}
                />
                <GrantRoleMenuItem contract={contract} disabled={contract.contractStatus === ContractStatus.INACTIVE} />
                <RevokeRoleMenuItem
                  contract={contract}
                  disabled={contract.contractStatus === ContractStatus.INACTIVE}
                />
                <RenounceRoleMenuItem
                  contract={contract}
                  disabled={contract.contractStatus === ContractStatus.INACTIVE}
                />
                <BlacklistMenuItem contract={contract} disabled={contract.contractStatus === ContractStatus.INACTIVE} />
                <UnBlacklistMenuItem
                  contract={contract}
                  disabled={contract.contractStatus === ContractStatus.INACTIVE}
                />
                <WhitelistMenuItem contract={contract} disabled={contract.contractStatus === ContractStatus.INACTIVE} />
                <UnWhitelistMenuItem
                  contract={contract}
                  disabled={contract.contractStatus === ContractStatus.INACTIVE}
                />
                <PauseMenuItem contract={contract} disabled={contract.contractStatus === ContractStatus.INACTIVE} />
                <UnPauseMenuItem contract={contract} disabled={contract.contractStatus === ContractStatus.INACTIVE} />
                <MintMenuItem contract={contract} disabled={contract.contractStatus === ContractStatus.INACTIVE} />
                <AllowanceMenuItem
                  contract={contract}
                  disabled={
                    contract.contractStatus === ContractStatus.INACTIVE ||
                    contract.contractFeatures.includes(ContractFeatures.SOULBOUND)
                  }
                />
                <RoyaltyMenuItem
                  contract={contract}
                  disabled={
                    contract.contractStatus === ContractStatus.INACTIVE ||
                    contract.contractFeatures.includes(ContractFeatures.SOULBOUND)
                  }
                />
                <TransferMenuItem
                  contract={contract}
                  disabled={
                    contract.contractStatus === ContractStatus.INACTIVE ||
                    contract.contractFeatures.includes(ContractFeatures.SOULBOUND)
                  }
                />
              </ListActions>
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

      <DeleteDialog
        onCancel={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        open={isDeleteDialogOpen}
        initialValues={selected}
      />

      <MysteryContractEditDialog
        onCancel={handleEditCancel}
        onConfirm={handleEditConfirm}
        open={isEditDialogOpen}
        initialValues={selected}
      />
    </Grid>
  );
};
