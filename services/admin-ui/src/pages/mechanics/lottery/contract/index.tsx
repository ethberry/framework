import { FC } from "react";
import { FormattedMessage } from "react-intl";
import { Button, Grid, List, ListItem, ListItemText, Pagination } from "@mui/material";
import { Create, Delete, FilterList } from "@mui/icons-material";

import { emptyStateString } from "@gemunion/draft-js-utils";
import { Breadcrumbs, PageHeader, ProgressOverlay } from "@gemunion/mui-page-layout";
import { DeleteDialog } from "@gemunion/mui-dialog-delete";
import { useCollection } from "@gemunion/react-hooks";
import type { IContract, IContractSearchDto } from "@framework/types";
import { ContractStatus } from "@framework/types";

import { LotteryContractDeployButton } from "../../../../components/buttons";
import { ContractSearchForm } from "../../../../components/forms/contract-search";
import { ListAction, ListActions } from "../../../../components/common/lists";
import { GrantRoleMenuItem } from "../../../../components/menu/extensions/grant-role";
import { RevokeRoleMenuItem } from "../../../../components/menu/extensions/revoke-role";
import { RenounceRoleMenuItem } from "../../../../components/menu/extensions/renounce-role";
import { PauseMenuItem } from "../../../../components/menu/mechanics/common/pause";
import { UnPauseMenuItem } from "../../../../components/menu/mechanics/common/unpause";
import { LotteryRoundStartMenuItem } from "../../../../components/menu/mechanics/lottery/contract/round-start";
import { LotteryRoundEndMenuItem } from "../../../../components/menu/mechanics/lottery/contract/round-end";
import { LotteryScheduleMenuItem } from "../../../../components/menu/mechanics/lottery/contract/schedule";
import { LotteryEditDialog } from "./edit";

export const LotteryContracts: FC = () => {
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
    baseUrl: "/lottery/contracts",
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

  return (
    <Grid>
      <Breadcrumbs path={["dashboard", "lottery", "lottery.contracts"]} />

      <PageHeader message="pages.lottery.title">
        <Button startIcon={<FilterList />} onClick={handleToggleFilters} data-testid="ToggleFilterButton">
          <FormattedMessage
            id={`form.buttons.${isFiltersOpen ? "hideFilters" : "showFilters"}`}
            data-testid="ToggleFiltersButton"
          />
        </Button>
        <LotteryContractDeployButton />
      </PageHeader>

      <ContractSearchForm
        onSubmit={handleSearch}
        initialValues={search}
        open={isFiltersOpen}
        contractFeaturesOptions={{}}
        onRefreshPage={handleRefreshPage}
      />

      <ProgressOverlay isLoading={isLoading}>
        <List>
          {rows.map(contract => (
            <ListItem key={contract.id}>
              <ListItemText sx={{ width: 0.6 }}>{contract.title}</ListItemText>
              <ListActions dataTestId="LotteryActionsMenuButton">
                <ListAction onClick={handleEdit(contract)} icon={Create} message="form.buttons.edit" />
                <ListAction
                  onClick={handleDelete(contract)}
                  icon={Delete}
                  message="form.buttons.delete"
                  disabled={contract.contractStatus === ContractStatus.INACTIVE}
                />
                <GrantRoleMenuItem contract={contract} disabled={contract.contractStatus === ContractStatus.INACTIVE} />
                <RevokeRoleMenuItem
                  contract={contract}
                  disabled={contract.contractStatus === ContractStatus.INACTIVE}
                />
                <RenounceRoleMenuItem
                  contract={contract}
                  disabled={contract.contractStatus === ContractStatus.INACTIVE}
                />
                <PauseMenuItem contract={contract} disabled={contract.contractStatus === ContractStatus.INACTIVE} />
                <UnPauseMenuItem contract={contract} disabled={contract.contractStatus === ContractStatus.INACTIVE} />
                <LotteryRoundStartMenuItem
                  contract={contract}
                  disabled={contract.contractStatus === ContractStatus.INACTIVE}
                />
                <LotteryRoundEndMenuItem
                  contract={contract}
                  disabled={contract.contractStatus === ContractStatus.INACTIVE}
                />
                <LotteryScheduleMenuItem
                  contract={contract}
                  refreshPage={handleRefreshPage}
                  disabled={contract.contractStatus === ContractStatus.INACTIVE}
                />
              </ListActions>
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

      <LotteryEditDialog
        onCancel={handleEditCancel}
        onConfirm={handleEditConfirm}
        open={isEditDialogOpen}
        initialValues={selected}
      />
    </Grid>
  );
};
