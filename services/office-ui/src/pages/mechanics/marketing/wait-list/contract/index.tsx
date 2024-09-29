import { FC } from "react";
import { Button, Grid, ListItemText } from "@mui/material";
import { Create, Delete, FilterList } from "@mui/icons-material";
import { FormattedMessage } from "react-intl";
import { useWeb3React } from "@web3-react/core";

import { emptyStateString } from "@ethberry/draft-js-utils";
import { Breadcrumbs, PageHeader } from "@ethberry/mui-page-layout";
import { DeleteDialog } from "@ethberry/mui-dialog-delete";
import { useCollection, CollectionActions } from "@ethberry/provider-collection";
import { useUser } from "@ethberry/provider-user";
import { ListAction, ListActions, ListItem, StyledPagination } from "@framework/styled";
import type { IContract, IContractSearchDto, IUser } from "@framework/types";
import { ContractStatus } from "@framework/types";

import { ContractSearchForm } from "../../../../../components/forms/contract-search";
import {
  WaitListDeployButton,
  GrantRoleButton,
  RevokeRoleButton,
  RenounceRoleButton,
  PauseButton,
  UnPauseButton,
  AllowanceButton,
  TopUpButton,
  EthListenerAddButton,
  EthListenerRemoveButton,
} from "../../../../../components/buttons";
import { WithCheckPermissionsListWrapper } from "../../../../../components/wrappers";
import { WaitListEditDialog } from "./edit";

export const WaitListContracts: FC = () => {
  const { profile } = useUser<IUser>();

  const {
    rows,
    count,
    search,
    action,
    selected,
    isLoading,
    isFiltersOpen,
    handleSearch,
    handleToggleFilters,
    handleEdit,
    handleEditCancel,
    handleEditConfirm,
    handleDelete,
    handleDeleteCancel,
    handleChangePage,
    handleDeleteConfirm,
  } = useCollection<IContract, IContractSearchDto>({
    baseUrl: "/wait-list/contracts",
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
      <Breadcrumbs path={["dashboard", "wait-list", "wait-list.contracts"]} />

      <PageHeader message="pages.wait-list.title">
        <Button startIcon={<FilterList />} onClick={handleToggleFilters} data-testid="ToggleFilterButton">
          <FormattedMessage id={`form.buttons.${isFiltersOpen ? "hideFilters" : "showFilters"}`} />
        </Button>
        <WaitListDeployButton />
      </PageHeader>

      <ContractSearchForm
        onSubmit={handleSearch}
        initialValues={search}
        open={isFiltersOpen}
        contractFeaturesOptions={{}}
      />

      <WithCheckPermissionsListWrapper isLoading={isLoading} count={rows.length}>
        {rows.map(contract => {
          return (
            <ListItem key={contract.id} account={account} contract={contract}>
              <ListItemText sx={{ width: 0.6 }}>{contract.title}</ListItemText>
              <ListActions>
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
                <PauseButton contract={contract} />
                <UnPauseButton contract={contract} />
                <AllowanceButton contract={contract} />
                <TopUpButton contract={contract} />
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

      <WaitListEditDialog
        onCancel={handleEditCancel}
        onConfirm={handleEditConfirm}
        open={action === CollectionActions.edit}
        initialValues={selected}
      />
    </Grid>
  );
};
