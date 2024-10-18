import { FC } from "react";
import { Button, Grid, ListItemText } from "@mui/material";
import { Create, Delete, FilterList, Visibility } from "@mui/icons-material";
import { FormattedMessage } from "react-intl";

import { emptyStateString } from "@ethberry/draft-js-utils";
import { Breadcrumbs, PageHeader, ProgressOverlay } from "@ethberry/mui-page-layout";
import { DeleteDialog } from "@ethberry/mui-dialog-delete";
import { CollectionActions, useCollection } from "@ethberry/provider-collection";
import { ListAction, ListActions, StyledListItem, StyledListWrapper, StyledPagination } from "@framework/styled";
import type { IContract, IContractSearchDto } from "@framework/types";
import { ContractStatus } from "@framework/types";

import { ContractSearchForm } from "../../../../../components/forms/contract-search";
import { PaymentSplitterBalanceButton, PaymentSplitterContractDeployButton } from "../../../../../components/buttons";
import { PaymentSplitterViewDialog } from "./view";
import { PaymentSplitterEditDialog } from "./edit";

export const PaymentSplitterContracts: FC = () => {
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
    handleView,
    handleEdit,
    handleDelete,
    handleViewCancel,
    handleEditCancel,
    handleDeleteCancel,
    handleChangePage,
    handleViewConfirm,
    handleEditConfirm,
    handleDeleteConfirm,
  } = useCollection<IContract, IContractSearchDto>({
    baseUrl: "/payment-splitter/contracts",
    empty: {
      title: "",
      description: emptyStateString,
      contractStatus: ContractStatus.NEW,
      parameters: {
        payees: [],
        shares: [],
      },
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
      <Breadcrumbs path={["dashboard", "payment-splitter", "payment-splitter.contracts"]} />

      <PageHeader message="pages.payment-splitter.title">
        <Button startIcon={<FilterList />} onClick={handleToggleFilters} data-testid="ToggleFilterButton">
          <FormattedMessage id={`form.buttons.${isFiltersOpen ? "hideFilters" : "showFilters"}`} />
        </Button>
        <PaymentSplitterContractDeployButton />
      </PageHeader>

      <ContractSearchForm
        onSubmit={handleSearch}
        initialValues={search}
        open={isFiltersOpen}
        contractFeaturesOptions={{}}
      />

      <ProgressOverlay isLoading={isLoading}>
        <StyledListWrapper count={rows.length} isLoading={isLoading}>
          {rows.map(contract => (
            <StyledListItem key={contract.id}>
              <ListItemText sx={{ width: 0.6 }}>{contract.title}</ListItemText>
              <ListActions>
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
                    disabled={contract.contractStatus === ContractStatus.INACTIVE}
                  />
                  <ListAction
                    onClick={handleView(contract)}
                    message="form.buttons.view"
                    dataTestId="ContractViewButton"
                    icon={Visibility}
                  />
                  <PaymentSplitterBalanceButton
                    contract={contract}
                    disabled={contract.contractStatus === ContractStatus.INACTIVE}
                  />
                </ListActions>
              </ListActions>
            </StyledListItem>
          ))}
        </StyledListWrapper>
      </ProgressOverlay>

      <StyledPagination
        shape="rounded"
        page={search.skip / search.take + 1}
        count={Math.ceil(count / search.take)}
        onChange={handleChangePage}
      />

      <PaymentSplitterViewDialog
        onCancel={handleViewCancel}
        onConfirm={handleViewConfirm}
        open={action === CollectionActions.view}
        initialValues={selected}
      />

      <PaymentSplitterEditDialog
        onCancel={handleEditCancel}
        onConfirm={handleEditConfirm}
        open={action === CollectionActions.edit}
        initialValues={selected}
      />

      <DeleteDialog
        onCancel={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        open={action === CollectionActions.delete}
        initialValues={selected}
      />
    </Grid>
  );
};
