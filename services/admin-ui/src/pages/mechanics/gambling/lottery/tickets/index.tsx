import { FC } from "react";
import { FormattedMessage } from "react-intl";
import { Button, Grid, ListItemText } from "@mui/material";
import { Create, Delete, FilterList } from "@mui/icons-material";
import { useWeb3React } from "@web3-react/core";

import { emptyStateString } from "@ethberry/draft-js-utils";
import { Breadcrumbs, PageHeader } from "@ethberry/mui-page-layout";
import { DeleteDialog } from "@ethberry/mui-dialog-delete";
import { CollectionActions, useCollection } from "@ethberry/provider-collection";
import { ListAction, ListActions, ListItem, StyledPagination } from "@framework/styled";
import type { IContract, IContractSearchDto } from "@framework/types";
import { ContractStatus, Erc721ContractTemplates } from "@framework/types";

import {
  ContractAllowanceButton,
  BlacklistButton,
  ContractMintButton,
  Erc721ContractDeployButton,
  GrantRoleButton,
  RenounceRoleButton,
  RevokeRoleButton,
  RoyaltyButton,
  TransferButton,
  UnBlacklistButton,
  UnWhitelistButton,
  WhitelistButton,
} from "../../../../../components/buttons";
import { ContractSearchForm } from "../../../../../components/forms/contract-search";
import { WithCheckPermissionsListWrapper } from "../../../../../components/wrappers";
import { LotteryEditDialog } from "./edit";

export const LotteryTicketContracts: FC = () => {
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
    baseUrl: "/lottery/ticket/contracts",
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

  const { account = "" } = useWeb3React();

  return (
    <Grid>
      <Breadcrumbs path={["dashboard", "lottery", "lottery.tickets"]} />

      <PageHeader message="pages.lottery.tickets.title">
        <Button startIcon={<FilterList />} onClick={handleToggleFilters} data-testid="ToggleFilterButton">
          <FormattedMessage id={`form.buttons.${isFiltersOpen ? "hideFilters" : "showFilters"}`} />
        </Button>
        <Erc721ContractDeployButton contractTemplate={Erc721ContractTemplates.LOTTERY} />
      </PageHeader>

      <ContractSearchForm
        onSubmit={handleSearch}
        initialValues={search}
        open={isFiltersOpen}
        contractFeaturesOptions={{}}
      />

      <WithCheckPermissionsListWrapper isLoading={isLoading} count={rows.length}>
        {rows.map(contract => (
          <ListItem key={contract.id} account={account} contract={contract}>
            <ListItemText sx={{ width: 0.6 }}>{contract.title}</ListItemText>
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
              <RoyaltyButton contract={contract} />
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

      <LotteryEditDialog
        onCancel={handleEditCancel}
        onConfirm={handleEditConfirm}
        open={action === CollectionActions.edit}
        initialValues={selected}
      />
    </Grid>
  );
};
