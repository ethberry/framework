import { FC } from "react";
import { FormattedMessage } from "react-intl";
import { Button, Grid, ListItemText } from "@mui/material";
import { Create, Delete, FilterList } from "@mui/icons-material";
import { useWeb3React } from "@web3-react/core";

import { Breadcrumbs, PageHeader, ProgressOverlay } from "@gemunion/mui-page-layout";
import { DeleteDialog } from "@gemunion/mui-dialog-delete";
import { CollectionActions, useCollection } from "@gemunion/react-hooks";
import { emptyStateString } from "@gemunion/draft-js-utils";
import {
  ListAction,
  ListActions,
  ListWrapperProvider,
  StyledListItem,
  StyledListWrapper,
  StyledPagination,
} from "@framework/styled";
import {
  CollectionContractFeatures,
  ContractStatus,
  IAccessControl,
  IContract,
  IContractSearchDto,
} from "@framework/types";

import {
  BlacklistButton,
  CollectionContractDeployButton,
  CollectionUploadButton,
  ContractAllowanceButton,
  EthListenerAddButton,
  EthListenerRemoveButton,
  GrantRoleButton,
  RenounceRoleButton,
  RevokeRoleButton,
  RoyaltyButton,
  SetBaseTokenURIButton,
  TransferButton,
  UnBlacklistButton,
} from "../../../../../components/buttons";
import { ContractSearchForm } from "../../../../../components/forms/contract-search";
import { Erc721CollectionEditDialog } from "./edit";
import { useCheckPermissions } from "../../../../../shared";

export const CollectionContract: FC = () => {
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

  const { checkPermissions } = useCheckPermissions();
  const { account = "" } = useWeb3React();

  return (
    <ListWrapperProvider<IAccessControl> callback={checkPermissions}>
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
          <StyledListWrapper count={rows.length} isLoading={isLoading} rows={rows} account={account} path={"address"}>
            {rows.map(contract => (
              <StyledListItem key={contract.id}>
                <ListItemText sx={{ width: 0.6 }}>{contract.title}</ListItemText>
                <ListItemText>{contract.parameters.batchSize}</ListItemText>
                <ListActions dataTestId="CollectionActionsMenuButton">
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
                    disabled={contract.contractStatus === ContractStatus.INACTIVE}
                  />
                  <GrantRoleButton contract={contract} />
                  <RevokeRoleButton contract={contract} />
                  <RenounceRoleButton contract={contract} />
                  <ContractAllowanceButton contract={contract} />
                  <RoyaltyButton contract={contract} />
                  <SetBaseTokenURIButton contract={contract} />
                  <BlacklistButton contract={contract} />
                  <UnBlacklistButton contract={contract} />
                  <TransferButton contract={contract} />
                  <CollectionUploadButton contract={contract} onRefreshPage={handleRefreshPage} />
                  <EthListenerAddButton contract={contract} />
                  <EthListenerRemoveButton contract={contract} />
                </ListActions>
              </StyledListItem>
            ))}
          </StyledListWrapper>
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
          open={action === CollectionActions.delete}
          initialValues={selected}
        />

        <Erc721CollectionEditDialog
          onCancel={handleEditCancel}
          onConfirm={handleEditConfirm}
          open={action === CollectionActions.edit}
          initialValues={selected}
        />
      </Grid>
    </ListWrapperProvider>
  );
};
