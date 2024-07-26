import { FC } from "react";
import { FormattedMessage } from "react-intl";
import { Button, Grid, ListItemText } from "@mui/material";
import { Create, Delete, FilterList } from "@mui/icons-material";
import { useWeb3React } from "@web3-react/core";

import { Breadcrumbs, PageHeader } from "@gemunion/mui-page-layout";
import { DeleteDialog } from "@gemunion/mui-dialog-delete";
import { CollectionActions, useCollection } from "@gemunion/provider-collection";
import { useUser } from "@gemunion/provider-user";
import { ListAction, ListActions, ListItem, StyledPagination } from "@framework/styled";
import type { IContract, IContractSearchDto, IUser } from "@framework/types";
import { ContractStatus, Erc998ContractFeatures } from "@framework/types";

import {
  AllowanceButton,
  BlacklistButton,
  Erc998ContractDeployButton,
  EthListenerAddButton,
  EthListenerRemoveButton,
  GrantRoleButton,
  ContractMintButton,
  RenounceRoleButton,
  RevokeRoleButton,
  RoyaltyButton,
  TransferButton,
  UnBlacklistButton,
  UnWhitelistButton,
  WhitelistButton,
} from "../../../../components/buttons";
import { ContractSearchForm } from "../../../../components/forms/contract-search";
import { WithCheckPermissionsListWrapper } from "../../../../components/wrappers";
import { Erc998ContractEditDialog } from "./edit";

export const Erc998Contract: FC = () => {
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
    baseUrl: "/erc998/contracts",
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

  const { account = "" } = useWeb3React();

  return (
    <Grid>
      <Breadcrumbs path={["dashboard", "erc998", "erc998.contracts"]} />

      <PageHeader message="pages.erc998.contracts.title">
        <Button startIcon={<FilterList />} onClick={handleToggleFilters} data-testid="ToggleFilterButton">
          <FormattedMessage id={`form.buttons.${isFiltersOpen ? "hideFilters" : "showFilters"}`} />
        </Button>
        <Erc998ContractDeployButton />
      </PageHeader>

      <ContractSearchForm
        onSubmit={handleSearch}
        initialValues={search}
        open={isFiltersOpen}
        contractFeaturesOptions={Erc998ContractFeatures}
      />

      <WithCheckPermissionsListWrapper isLoading={isLoading} count={rows.length}>
        {rows.map(contract => {
          return (
            <ListItem key={contract.id} account={account} contract={contract}>
              <ListItemText>{contract.title}</ListItemText>
              <ListActions dataTestId="ContractActionsMenuButton">
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
                <BlacklistButton contract={contract} />
                <UnBlacklistButton contract={contract} />
                <WhitelistButton contract={contract} />
                <UnWhitelistButton contract={contract} />
                <ContractMintButton contract={contract} />
                <AllowanceButton contract={contract} />
                <TransferButton contract={contract} />
                <RoyaltyButton contract={contract} />
                <EthListenerAddButton contract={contract} />
                <EthListenerRemoveButton contract={contract} />
              </ListActions>
            </ListItem>
          );
        })}
      </WithCheckPermissionsListWrapper>

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

      <Erc998ContractEditDialog
        onCancel={handleEditCancel}
        onConfirm={handleEditConfirm}
        open={action === CollectionActions.edit}
        initialValues={selected}
      />
    </Grid>
  );
};
