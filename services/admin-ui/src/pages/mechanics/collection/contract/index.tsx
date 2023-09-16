import { FC } from "react";
import { FormattedMessage } from "react-intl";
import { Button, Grid, List, ListItem, ListItemText, Pagination } from "@mui/material";
import { Create, Delete, FilterList } from "@mui/icons-material";

import { Breadcrumbs, PageHeader, ProgressOverlay } from "@gemunion/mui-page-layout";
import { DeleteDialog } from "@gemunion/mui-dialog-delete";
import { useCollection } from "@gemunion/react-hooks";
import { emptyStateString } from "@gemunion/draft-js-utils";
import {
  CollectionContractFeatures,
  ContractFeatures,
  ContractStatus,
  IContract,
  IContractSearchDto,
} from "@framework/types";

import { CollectionContractDeployButton } from "../../../../components/buttons";
import { ContractSearchForm } from "../../../../components/forms/contract-search";
import { Erc721CollectionEditDialog } from "./edit";
import { ListAction, ListActions } from "../../../../components/common/lists";
import { GrantRoleMenuItem } from "../../../../components/menu/extensions/grant-role";
import { RevokeRoleMenuItem } from "../../../../components/menu/extensions/revoke-role";
import { RenounceRoleMenuItem } from "../../../../components/menu/extensions/renounce-role";
import { AllowanceMenuItem } from "../../../../components/menu/hierarchy/contract/allowance";
import { RoyaltyMenuItem } from "../../../../components/menu/common/royalty";
import { BlacklistMenuItem } from "../../../../components/menu/extensions/blacklist-add";
import { UnBlacklistMenuItem } from "../../../../components/menu/extensions/blacklist-remove";
import { TransferMenuItem } from "../../../../components/menu/common/transfer";
import { CollectionUploadMenuItem } from "../../../../components/menu/mechanics/collection/upload";

export const CollectionContract: FC = () => {
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
    handleRefreshPage,
  } = useCollection<IContract, IContractSearchDto>({
    baseUrl: "/collection/contracts",
    empty: {
      title: "",
      description: emptyStateString,
      contractStatus: ContractStatus.NEW,
      parameters: {
        owner: "",
        batchSize: 0,
      },
    },
    search: {
      query: "",
      contractStatus: [ContractStatus.ACTIVE, ContractStatus.NEW, ContractStatus.INACTIVE],
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
      <Breadcrumbs path={["dashboard", "collection", "collection.contract"]} />

      <PageHeader message="pages.collection.contracts">
        <Button startIcon={<FilterList />} onClick={handleToggleFilters} data-testid="ToggleFilterButton">
          <FormattedMessage
            id={`form.buttons.${isFiltersOpen ? "hideFilters" : "showFilters"}`}
            data-testid="ToggleFiltersButton"
          />
        </Button>
        <CollectionContractDeployButton />
      </PageHeader>

      <ContractSearchForm
        onSubmit={handleSearch}
        initialValues={search}
        open={isFiltersOpen}
        contractFeaturesOptions={CollectionContractFeatures}
        onRefreshPage={handleRefreshPage}
      />

      <ProgressOverlay isLoading={isLoading}>
        <List>
          {rows.map(contract => (
            <ListItem key={contract.id}>
              <ListItemText sx={{ width: 0.6 }}>{contract.title}</ListItemText>
              <ListItemText>{contract.parameters.batchSize}</ListItemText>
              <ListActions dataTestId="CollectionActionsMenuButton">
                <ListAction onClick={handleEdit(contract)} icon={Create} message="form.buttons.edit" />
                <ListAction
                  onClick={handleDelete(contract)}
                  disabled={contract.contractStatus === ContractStatus.INACTIVE}
                  icon={Delete}
                  message="form.buttons.delete"
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
                <BlacklistMenuItem contract={contract} disabled={contract.contractStatus === ContractStatus.INACTIVE} />
                <UnBlacklistMenuItem
                  contract={contract}
                  disabled={contract.contractStatus === ContractStatus.INACTIVE}
                />
                <TransferMenuItem
                  contract={contract}
                  disabled={
                    contract.contractStatus === ContractStatus.INACTIVE ||
                    contract.contractFeatures.includes(ContractFeatures.SOULBOUND)
                  }
                />
                <CollectionUploadMenuItem
                  contract={contract}
                  disabled={contract.contractStatus === ContractStatus.INACTIVE}
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

      <Erc721CollectionEditDialog
        onCancel={handleEditCancel}
        onConfirm={handleEditConfirm}
        open={isEditDialogOpen}
        initialValues={selected}
      />
    </Grid>
  );
};
