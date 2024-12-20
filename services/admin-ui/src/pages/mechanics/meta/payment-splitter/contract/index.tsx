import { FC } from "react";
import { Button, Grid, ListItemText } from "@mui/material";
import { FilterList, Visibility } from "@mui/icons-material";
import { FormattedMessage } from "react-intl";

import { emptyStateString } from "@gemunion/draft-js-utils";
import { Breadcrumbs, PageHeader, ProgressOverlay } from "@gemunion/mui-page-layout";
// import { DeleteDialog } from "@gemunion/mui-dialog-delete";
import { CollectionActions, useCollection } from "@gemunion/provider-collection";
import { ListAction, ListActions, StyledListItem, StyledListWrapper, StyledPagination } from "@framework/styled";
import type { IContract, IContractSearchDto } from "@framework/types";
import { ContractStatus } from "@framework/types";

import { ContractSearchForm } from "../../../../../components/forms/contract-search";
import { PaymentSplitterBalanceButton, PaymentSplitterContractDeployButton } from "../../../../../components/buttons";
import { PaymentSplitterViewDialog } from "./view";

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
    handleViewCancel,
    handleChangePage,
    handleViewConfirm,
    handleRefreshPage,
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
        onRefreshPage={handleRefreshPage}
      />

      <ProgressOverlay isLoading={isLoading}>
        <StyledListWrapper count={rows.length} isLoading={isLoading}>
          {rows.map(contract => (
            <StyledListItem key={contract.id}>
              <ListItemText sx={{ width: 0.6 }}>{contract.title}</ListItemText>
              <ListActions>
                <ListActions>
                  <ListAction
                    onClick={handleView(contract)}
                    message="form.buttons.view"
                    dataTestId="ContractViewButton"
                    icon={Visibility}
                  />
                  {/* <ListAction */}
                  {/*  onClick={handleDelete(contract)} */}
                  {/*  message="form.buttons.delete" */}
                  {/*  dataTestId="ContractDeleteButton" */}
                  {/*  icon={Delete} */}
                  {/*  disabled={contract.contractStatus === ContractStatus.INACTIVE} */}
                  {/* /> */}
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

      {/* <DeleteDialog */}
      {/*  onCancel={handleDeleteCancel} */}
      {/*  onConfirm={handleDeleteConfirm} */}
      {/*  open={action === CollectionActions.delete} */}
      {/*  initialValues={selected} */}
      {/* /> */}
    </Grid>
  );
};
