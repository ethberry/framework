import { FC } from "react";
import { FormattedMessage } from "react-intl";
import { Button, Grid, ListItemText } from "@mui/material";
import { Create, Delete, FilterList } from "@mui/icons-material";

import { emptyStateString } from "@gemunion/draft-js-utils";
import { Breadcrumbs, PageHeader, ProgressOverlay } from "@gemunion/mui-page-layout";
import { DeleteDialog } from "@gemunion/mui-dialog-delete";
import { CollectionActions, useCollection } from "@gemunion/react-hooks";
import { useUser } from "@gemunion/provider-user";
import { ListAction, ListActions, StyledListItem, StyledListWrapper, StyledPagination } from "@framework/styled";
import type { IContract, IContractSearchDto, IUser } from "@framework/types";
import { ContractStatus, StakingContractFeatures } from "@framework/types";

import {
  StakingAllowanceButton,
  EthListenerAddButton,
  EthListenerRemoveButton,
  GrantRoleButton,
  PauseButton,
  RenounceRoleButton,
  RevokeRoleButton,
  StakingDeployButton,
  TopUpButton,
  UnPauseButton,
} from "../../../../../components/buttons";
import { ContractSearchForm } from "../../../../../components/forms/contract-search";
import { StakingEditDialog } from "./edit";

export const StakingContracts: FC = () => {
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
    baseUrl: "/staking/contracts",
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
      <Breadcrumbs path={["dashboard", "staking", "staking.contracts"]} />

      <PageHeader message="pages.staking.title">
        <Button startIcon={<FilterList />} onClick={handleToggleFilters} data-testid="ToggleFilterButton">
          <FormattedMessage id={`form.buttons.${isFiltersOpen ? "hideFilters" : "showFilters"}`} />
        </Button>
        <StakingDeployButton />
      </PageHeader>

      <ContractSearchForm
        onSubmit={handleSearch}
        initialValues={search}
        open={isFiltersOpen}
        contractFeaturesOptions={StakingContractFeatures}
      />

      <ProgressOverlay isLoading={isLoading}>
        <StyledListWrapper count={rows.length} isLoading={isLoading}>
          {rows.map(contract => {
            return (
              <StyledListItem key={contract.id}>
                <ListItemText sx={{ width: 0.6 }}>{contract.title}</ListItemText>
                <ListItemText>{contract.parameters.maxStake}</ListItemText>
                <ListActions dataTestId="StakingActionsMenuButton">
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
                  <StakingAllowanceButton contract={contract} />
                  <TopUpButton contract={contract} />
                  <EthListenerAddButton contract={contract} />
                  <EthListenerRemoveButton contract={contract} />
                </ListActions>
              </StyledListItem>
            );
          })}
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

      <StakingEditDialog
        onCancel={handleEditCancel}
        onConfirm={handleEditConfirm}
        open={action === CollectionActions.edit}
        initialValues={selected}
      />
    </Grid>
  );
};
