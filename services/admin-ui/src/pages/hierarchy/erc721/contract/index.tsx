import { FC, Fragment } from "react";
import { FormattedMessage } from "react-intl";
import { Button, Grid, ListItemText } from "@mui/material";
import { Add, Create, Delete, FilterList } from "@mui/icons-material";
import { useWeb3React } from "@web3-react/core";

import { Breadcrumbs, PageHeader } from "@ethberry/mui-page-layout";
import { DeleteDialog } from "@ethberry/mui-dialog-delete";
import { CollectionActions, useCollection } from "@ethberry/provider-collection";
import { emptyStateString } from "@ethberry/draft-js-utils";
import type { IContract, IContractSearchDto } from "@framework/types";
import { BusinessType, ContractStatus, Erc721ContractFeatures } from "@framework/types";
import { ListAction, ListActions, ListItem, StyledPagination } from "@framework/styled";

import {
  BlacklistButton,
  ChainLinkSetSubscriptionButton,
  ContractAllowanceButton,
  ContractMintButton,
  DefaultRoyaltyButton,
  Erc721ContractDeployButton,
  GrantRoleButton,
  RenounceRoleButton,
  RevokeRoleButton,
  SetBaseTokenURIButton,
  TransferButton,
  UnBlacklistButton,
  UnWhitelistButton,
  WhitelistButton,
} from "../../../../components/buttons";
import { ContractSearchForm } from "../../../../components/forms/contract-search";
import { WithCheckPermissionsListWrapper } from "../../../../components/wrappers";
import { Erc721ContractEditDialog } from "./edit";

export const Erc721Contract: FC = () => {
  const {
    rows,
    count,
    search,
    action,
    selected,
    isLoading,
    isFiltersOpen,
    handleToggleFilters,
    handleCreate,
    handleEdit,
    handleEditCancel,
    handleEditConfirm,
    handleDelete,
    handleDeleteCancel,
    handleSearch,
    handleChangePage,
    handleDeleteConfirm,
  } = useCollection<IContract, IContractSearchDto>({
    baseUrl: "/erc721/contracts",
    empty: {
      title: "",
      description: emptyStateString,
      parameters: {
        vrfSubId: "",
      },
      symbol: "",
      address: "",
      imageUrl: "",
      contractFeatures: [],
    },
    search: {
      query: "",
      contractStatus: [ContractStatus.ACTIVE, ContractStatus.NEW],
      contractFeatures: [],
    },
    filter: ({ id, title, description, imageUrl, contractStatus, symbol, address }) =>
      id
        ? {
            title,
            description,
            imageUrl,
            contractStatus,
          }
        : {
            title,
            description,
            symbol,
            address,
            imageUrl,
          },
  });

  const { account = "" } = useWeb3React();

  return (
    <Grid>
      <Breadcrumbs path={["dashboard", "erc721", "erc721.contracts"]} />

      <PageHeader message="pages.erc721.contracts.title">
        <Button startIcon={<FilterList />} onClick={handleToggleFilters} data-testid="ToggleFilterButton">
          <FormattedMessage id={`form.buttons.${isFiltersOpen ? "hideFilters" : "showFilters"}`} />
        </Button>
        {process.env.BUSINESS_TYPE === BusinessType.B2B ? (
          <Fragment />
        ) : (
          <Button variant="outlined" startIcon={<Add />} onClick={handleCreate} data-testid="Erc721TokenCreateButton">
            <FormattedMessage id="form.buttons.create" />
          </Button>
        )}
        <Erc721ContractDeployButton />
      </PageHeader>

      <ContractSearchForm
        onSubmit={handleSearch}
        initialValues={search}
        open={isFiltersOpen}
        contractFeaturesOptions={Erc721ContractFeatures}
      />

      <WithCheckPermissionsListWrapper isLoading={isLoading} count={rows.length}>
        {rows.map(contract => (
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
              <ContractAllowanceButton contract={contract} />
              <TransferButton contract={contract} />
              <DefaultRoyaltyButton contract={contract} />
              <SetBaseTokenURIButton contract={contract} />
              <ChainLinkSetSubscriptionButton contract={contract} />
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

      <DeleteDialog
        onCancel={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        open={action === CollectionActions.delete}
        initialValues={selected}
      />

      <Erc721ContractEditDialog
        onCancel={handleEditCancel}
        onConfirm={handleEditConfirm}
        open={action === CollectionActions.edit}
        initialValues={selected}
      />
    </Grid>
  );
};
