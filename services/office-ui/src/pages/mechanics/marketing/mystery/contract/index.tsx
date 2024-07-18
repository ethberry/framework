import { FC } from "react";
import { FormattedMessage } from "react-intl";
import { Button, Grid, ListItemText } from "@mui/material";
import { Create, Delete, FilterList } from "@mui/icons-material";
import { useWeb3React } from "@web3-react/core";

import { Breadcrumbs, PageHeader } from "@gemunion/mui-page-layout";
import { DeleteDialog } from "@gemunion/mui-dialog-delete";
import { CollectionActions, useCollection } from "@gemunion/react-hooks";
import { emptyStateString } from "@gemunion/draft-js-utils";
import { useUser } from "@gemunion/provider-user";
import { ListAction, ListActions, ListItem, StyledPagination } from "@framework/styled";
import type { IContract, IContractSearchDto, IUser } from "@framework/types";
import { ContractStatus, MysteryContractFeatures } from "@framework/types";

import {
  AllowanceButton,
  BlacklistButton,
  EthListenerAddButton,
  EthListenerRemoveButton,
  GrantRoleButton,
  MysteryContractDeployButton,
  MysteryContractMintButton,
  PauseButton,
  RenounceRoleButton,
  RevokeRoleButton,
  RoyaltyButton,
  TransferButton,
  UnBlacklistButton,
  UnPauseButton,
  UnWhitelistButton,
  WhitelistButton,
} from "../../../../../components/buttons";
import { ContractSearchForm } from "../../../../../components/forms/contract-search";
import { WithCheckPermissionsListWrapper } from "../../../../../components/wrappers";
import { MysteryContractEditDialog } from "./edit";

export const MysteryContract: FC = () => {
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
    handleDeleteConfirm,
    handleSearch,
    handleChangePage,
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
      merchantId: profile.merchantId,
    },
    filter: ({ title, description, imageUrl, contractStatus }) => ({
      title,
      description,
      imageUrl,
      contractStatus,
    }),
  });

  const { account = "" } = useWeb3React();

  return (
    <Grid>
      <Breadcrumbs path={["dashboard", "mystery", "mystery.contracts"]} />

      <PageHeader message="pages.mystery.contracts.title">
        <Button startIcon={<FilterList />} onClick={handleToggleFilters} data-testid="ToggleFilterButton">
          <FormattedMessage id={`form.buttons.${isFiltersOpen ? "hideFilters" : "showFilters"}`} />
        </Button>
        <MysteryContractDeployButton />
      </PageHeader>

      <ContractSearchForm
        onSubmit={handleSearch}
        initialValues={search}
        open={isFiltersOpen}
        contractFeaturesOptions={MysteryContractFeatures}
      />

      <WithCheckPermissionsListWrapper isLoading={isLoading} count={rows.length}>
        {rows.map(contract => {
          return (
            <ListItem key={contract.id} account={account} contract={contract}>
              <ListItemText>{contract.title}</ListItemText>
              <ListActions dataTestId="MysteryActionsMenuButton">
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
                <BlacklistButton contract={contract} />
                <UnBlacklistButton contract={contract} />
                <WhitelistButton contract={contract} />
                <UnWhitelistButton contract={contract} />
                <PauseButton contract={contract} />
                <UnPauseButton contract={contract} />
                <MysteryContractMintButton contract={contract} />
                <AllowanceButton contract={contract} />
                <RoyaltyButton contract={contract} />
                <TransferButton contract={contract} />
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

      <MysteryContractEditDialog
        onCancel={handleEditCancel}
        onConfirm={handleEditConfirm}
        open={action === CollectionActions.edit}
        initialValues={selected}
      />
    </Grid>
  );
};
