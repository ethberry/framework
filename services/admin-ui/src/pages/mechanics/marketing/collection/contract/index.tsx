import { FC } from "react";
import { FormattedMessage } from "react-intl";
import { Button, Grid, List, ListItemText } from "@mui/material";
import { Create, Delete, FilterList } from "@mui/icons-material";

import { Breadcrumbs, PageHeader, ProgressOverlay } from "@gemunion/mui-page-layout";
import { DeleteDialog } from "@gemunion/mui-dialog-delete";
import { useCollection } from "@gemunion/react-hooks";
import { emptyStateString } from "@gemunion/draft-js-utils";
import { ListAction, ListActions, StyledListItem, StyledPagination } from "@framework/styled";
import { CollectionContractFeatures, ContractStatus, IContract, IContractSearchDto } from "@framework/types";

import { CollectionContractDeployButton } from "../../../../../components/buttons";
import { ContractSearchForm } from "../../../../../components/forms/contract-search";
import { GrantRoleButton } from "../../../../../components/buttons/extensions/grant-role";
import { RevokeRoleButton } from "../../../../../components/buttons/extensions/revoke-role";
import { RenounceRoleButton } from "../../../../../components/buttons/extensions/renounce-role";
import { AllowanceButton } from "../../../../../components/buttons/hierarchy/contract/allowance";
import { RoyaltyButton } from "../../../../../components/buttons/common/royalty";
import { BlacklistButton } from "../../../../../components/buttons/extensions/blacklist-add";
import { UnBlacklistButton } from "../../../../../components/buttons/extensions/blacklist-remove";
import { TransferButton } from "../../../../../components/buttons/common/transfer";
import { CollectionUploadButton } from "../../../../../components/buttons/mechanics/collection/upload";
import { EthListenerAddButton } from "../../../../../components/buttons/common/eth-add";
import { EthListenerRemoveButton } from "../../../../../components/buttons/common/eth-remove";
import { Erc721CollectionEditDialog } from "./edit";

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
          <FormattedMessage id={`form.buttons.${isFiltersOpen ? "hideFilters" : "showFilters"}`} />
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
          {rows.map(contract => {
            const itemDisabled = contract.contractStatus === ContractStatus.INACTIVE;
            return (
              <StyledListItem key={contract.id}>
                <ListItemText sx={{ width: 0.6 }}>{contract.title}</ListItemText>
                <ListItemText>{contract.parameters.batchSize}</ListItemText>
                <ListActions dataTestId="CollectionActionsMenuButton">
                  <ListAction onClick={handleEdit(contract)} message="form.buttons.edit" icon={Create} />
                  <ListAction
                    onClick={handleDelete(contract)}
                    disabled={itemDisabled}
                    icon={Delete}
                    message="form.buttons.delete"
                  />
                  <GrantRoleButton contract={contract} disabled={itemDisabled} />
                  <RevokeRoleButton contract={contract} disabled={itemDisabled} />
                  <RenounceRoleButton contract={contract} disabled={itemDisabled} />
                  <AllowanceButton contract={contract} disabled={itemDisabled} />
                  <RoyaltyButton contract={contract} disabled={itemDisabled} />
                  <BlacklistButton contract={contract} disabled={itemDisabled} />
                  <UnBlacklistButton contract={contract} disabled={itemDisabled} />
                  <TransferButton contract={contract} disabled={itemDisabled} />
                  <CollectionUploadButton
                    contract={contract}
                    disabled={itemDisabled}
                    onRefreshPage={handleRefreshPage}
                  />
                  <EthListenerAddButton contract={contract} disabled={itemDisabled} />
                  <EthListenerRemoveButton contract={contract} disabled={itemDisabled} />
                </ListActions>
              </StyledListItem>
            );
          })}
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

      <Erc721CollectionEditDialog
        onCancel={handleEditCancel}
        onConfirm={handleEditConfirm}
        open={isEditDialogOpen}
        initialValues={selected}
      />
    </Grid>
  );
};
