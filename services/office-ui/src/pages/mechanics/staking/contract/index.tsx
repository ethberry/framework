import { FC } from "react";
import { FormattedMessage } from "react-intl";
import {
  Button,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemSecondaryAction,
  ListItemText,
  Pagination,
} from "@mui/material";
import { Create, Delete, FilterList } from "@mui/icons-material";

import { emptyStateString } from "@gemunion/draft-js-utils";
import { Breadcrumbs, PageHeader, ProgressOverlay } from "@gemunion/mui-page-layout";
import { DeleteDialog } from "@gemunion/mui-dialog-delete";
import { useCollection } from "@gemunion/react-hooks";
import { useUser } from "@gemunion/provider-user";
import { ContractStatus, IContract, IContractSearchDto, IUser, StakingContractFeatures } from "@framework/types";

import { StakingEditDialog } from "./edit";
import { ContractActionsMenu } from "../../../../components/menu/hierarchy/contract";
import { ContractSearchForm } from "../../../../components/forms/contract-search";
import { StakingDeployButton } from "../../../../components/buttons";

export const StakingContracts: FC = () => {
  const user = useUser<IUser>();

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
  } = useCollection<IContract, IContractSearchDto>({
    baseUrl: "/staking/contracts",
    empty: {
      title: "",
      description: emptyStateString,
      merchantId: user.profile.merchantId,
    },
    search: {
      query: "",
      contractStatus: [ContractStatus.ACTIVE, ContractStatus.NEW],
      contractFeatures: [],
      merchantId: user.profile.merchantId,
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
          <FormattedMessage
            id={`form.buttons.${isFiltersOpen ? "hideFilters" : "showFilters"}`}
            data-testid="ToggleFiltersButton"
          />
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
        <List>
          {rows.map((contract, i) => (
            <ListItem key={i}>
              <ListItemText sx={{ width: 0.6 }}>{contract.title}</ListItemText>
              <ListItemText>{contract.parameters.maxStake}</ListItemText>
              <ListItemSecondaryAction>
                <IconButton onClick={handleEdit(contract)}>
                  <Create />
                </IconButton>
                <IconButton
                  onClick={handleDelete(contract)}
                  disabled={contract.contractStatus === ContractStatus.INACTIVE}
                >
                  <Delete />
                </IconButton>
                <ContractActionsMenu
                  contract={contract}
                  disabled={contract.contractStatus === ContractStatus.INACTIVE}
                />
              </ListItemSecondaryAction>
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

      <StakingEditDialog
        onCancel={handleEditCancel}
        onConfirm={handleEditConfirm}
        open={isEditDialogOpen}
        initialValues={selected}
      />
    </Grid>
  );
};
