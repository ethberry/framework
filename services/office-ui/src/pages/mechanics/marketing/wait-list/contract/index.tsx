import { FC } from "react";
import { Button, Grid, ListItemText } from "@mui/material";
import { Create, Delete, FilterList } from "@mui/icons-material";
import { FormattedMessage } from "react-intl";

import { emptyStateString } from "@gemunion/draft-js-utils";
import { Breadcrumbs, PageHeader, ProgressOverlay } from "@gemunion/mui-page-layout";
import { DeleteDialog } from "@gemunion/mui-dialog-delete";
import { useCollection } from "@gemunion/react-hooks";
import { useUser } from "@gemunion/provider-user";
import { ListAction, ListActions, StyledListItem, StyledListWrapper, StyledPagination } from "@framework/styled";
import type { IContract, IContractSearchDto, IUser } from "@framework/types";
import { ContractStatus } from "@framework/types";

import { ContractSearchForm } from "../../../../../components/forms/contract-search";
import { WaitListDeployButton } from "../../../../../components/buttons";
import { GrantRoleButton } from "../../../../../components/buttons/extensions/grant-role";
import { RevokeRoleButton } from "../../../../../components/buttons/extensions/revoke-role";
import { RenounceRoleButton } from "../../../../../components/buttons/extensions/renounce-role";
import { PauseButton } from "../../../../../components/buttons/mechanics/common/pause";
import { UnPauseButton } from "../../../../../components/buttons/mechanics/common/unpause";
import { AllowanceButton } from "../../../../../components/buttons/mechanics/common/allowance";
import { TopUpButton } from "../../../../../components/buttons/mechanics/common/top-up";
import { EthListenerAddButton } from "../../../../../components/buttons/common/eth-add";
import { EthListenerRemoveButton } from "../../../../../components/buttons/common/eth-remove";
import { WaitListEditDialog } from "./edit";

export const WaitListContracts: FC = () => {
  const { profile } = useUser<IUser>();

  const {
    rows,
    count,
    search,
    selected,
    isLoading,
    isFiltersOpen,
    isEditDialogOpen,
    isDeleteDialogOpen,
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

      <ProgressOverlay isLoading={isLoading}>
        <StyledListWrapper count={rows.length} isLoading={isLoading}>
          {rows.map(contract => {
            const itemDisabled = contract.contractStatus === ContractStatus.INACTIVE;
            return (
              <StyledListItem key={contract.id}>
                <ListItemText sx={{ width: 0.6 }}>{contract.title}</ListItemText>
                <ListActions>
                  <ListAction onClick={handleEdit(contract)} message="form.buttons.edit" icon={Create} />
                  <ListAction
                    onClick={handleDelete(contract)}
                    icon={Delete}
                    message="form.buttons.delete"
                    disabled={itemDisabled}
                  />
                  <GrantRoleButton contract={contract} disabled={itemDisabled} />
                  <RevokeRoleButton contract={contract} disabled={itemDisabled} />
                  <RenounceRoleButton contract={contract} disabled={itemDisabled} />
                  <PauseButton contract={contract} disabled={itemDisabled} />
                  <UnPauseButton contract={contract} disabled={itemDisabled} />
                  <AllowanceButton contract={contract} disabled={itemDisabled} />
                  <TopUpButton contract={contract} disabled={itemDisabled} />
                  <EthListenerAddButton contract={contract} disabled={itemDisabled} />
                  <EthListenerRemoveButton contract={contract} disabled={itemDisabled} />
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
        open={isDeleteDialogOpen}
        initialValues={selected}
      />

      <WaitListEditDialog
        onCancel={handleEditCancel}
        onConfirm={handleEditConfirm}
        open={isEditDialogOpen}
        initialValues={selected}
      />
    </Grid>
  );
};
