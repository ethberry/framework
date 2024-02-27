import { FC } from "react";
import { FormattedMessage } from "react-intl";
import { Button, Grid, List, ListItemText } from "@mui/material";
import { Create, Delete, FilterList } from "@mui/icons-material";

import { emptyStateString } from "@gemunion/draft-js-utils";
import { Breadcrumbs, PageHeader, ProgressOverlay } from "@gemunion/mui-page-layout";
import { DeleteDialog } from "@gemunion/mui-dialog-delete";
import { useCollection } from "@gemunion/react-hooks";
import { ListAction, ListActions, StyledListItem, StyledPagination } from "@framework/styled";
import type { IContract, IContractSearchDto } from "@framework/types";
import { ContractStatus, Erc721ContractTemplates } from "@framework/types";

import { Erc721ContractDeployButton } from "../../../../../components/buttons";
import { ContractSearchForm } from "../../../../../components/forms/contract-search";
import { GrantRoleButton } from "../../../../../components/buttons/extensions/grant-role";
import { RevokeRoleButton } from "../../../../../components/buttons/extensions/revoke-role";
import { RenounceRoleButton } from "../../../../../components/buttons/extensions/renounce-role";
import { BlacklistButton } from "../../../../../components/buttons/extensions/blacklist-add";
import { UnBlacklistButton } from "../../../../../components/buttons/extensions/blacklist-remove";
import { WhitelistButton } from "../../../../../components/buttons/extensions/whitelist-add";
import { UnWhitelistButton } from "../../../../../components/buttons/extensions/whitelist-remove";
import { MintButton } from "../../../../../components/buttons/hierarchy/contract/mint";
import { AllowanceButton } from "../../../../../components/buttons/hierarchy/contract/allowance";
import { TransferButton } from "../../../../../components/buttons/common/transfer";
import { RoyaltyButton } from "../../../../../components/buttons/common/royalty";
import { RaffleEditDialog } from "./edit";

export const RaffleTickets: FC = () => {
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
    baseUrl: "/raffle/tickets",
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
      <Breadcrumbs path={["dashboard", "raffle", "raffle.tickets"]} />

      <PageHeader message="pages.raffle.tickets.title">
        <Button startIcon={<FilterList />} onClick={handleToggleFilters} data-testid="ToggleFilterButton">
          <FormattedMessage id={`form.buttons.${isFiltersOpen ? "hideFilters" : "showFilters"}`} />
        </Button>
        <Erc721ContractDeployButton contractTemplate={Erc721ContractTemplates.RAFFLE} />
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
            <StyledListItem key={contract.id}>
              <ListItemText sx={{ width: 0.6 }}>{contract.title}</ListItemText>
              <ListActions dataTestId="ContractActionsMenuButton">
                <ListAction onClick={handleEdit(contract)} message="form.buttons.edit" icon={Create} />
                <ListAction
                  onClick={handleDelete(contract)}
                  disabled={contract.contractStatus === ContractStatus.INACTIVE}
                  icon={Delete}
                  message="form.buttons.delete"
                />
                <GrantRoleButton contract={contract} />
                <RevokeRoleButton contract={contract} />
                <RenounceRoleButton contract={contract} />
                <BlacklistButton contract={contract} />
                <UnBlacklistButton contract={contract} />
                <WhitelistButton contract={contract} />
                <UnWhitelistButton contract={contract} />
                <MintButton contract={contract} />
                <AllowanceButton contract={contract} />
                <TransferButton contract={contract} />
                <RoyaltyButton contract={contract} />
              </ListActions>
            </StyledListItem>
          ))}
        </List>
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

      <RaffleEditDialog
        onCancel={handleEditCancel}
        onConfirm={handleEditConfirm}
        open={isEditDialogOpen}
        initialValues={selected}
      />
    </Grid>
  );
};
