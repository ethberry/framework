import { FC } from "react";
import { Button, Grid, List, ListItemText } from "@mui/material";
import { FilterList, Visibility } from "@mui/icons-material";
import { FormattedMessage } from "react-intl";

import { emptyStateString } from "@gemunion/draft-js-utils";
import { Breadcrumbs, PageHeader, ProgressOverlay } from "@gemunion/mui-page-layout";
// import { DeleteDialog } from "@gemunion/mui-dialog-delete";
import { useCollection } from "@gemunion/react-hooks";
import { ListAction, ListActions, StyledListItem, StyledPagination } from "@framework/styled";
import type { IContract, IContractSearchDto } from "@framework/types";
import { ContractStatus } from "@framework/types";

import { ContractSearchForm } from "../../../../components/forms/contract-search";
import { PaymentSplitterContractDeployButton } from "../../../../components/buttons";
import { PaymentSplitterViewDialog } from "./view";
import { PaymentSplitterBalanceButton } from "../../../../components/buttons/mechanics/payment-splitter/balances";

export const PaymentSplitterContracts: FC = () => {
  const {
    rows,
    count,
    search,
    selected,
    isLoading,
    isFiltersOpen,
    isViewDialogOpen,
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
        <List>
          {rows.map(contract => (
            <StyledListItem key={contract.id}>
              <ListItemText sx={{ width: 0.6 }}>{contract.title}</ListItemText>
              <ListActions>
                <ListActions>
                  <ListAction onClick={handleView(contract)} message="form.tips.view" icon={Visibility} />
                  {/* <ListAction */}
                  {/*  onClick={handleDelete(contract)} */}
                  {/*  icon={Delete} */}
                  {/*  message="form.buttons.delete" */}
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
        </List>
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
        open={isViewDialogOpen}
        initialValues={selected}
      />

      {/* <DeleteDialog */}
      {/*  onCancel={handleDeleteCancel} */}
      {/*  onConfirm={handleDeleteConfirm} */}
      {/*  open={isDeleteDialogOpen} */}
      {/*  initialValues={selected} */}
      {/* /> */}
    </Grid>
  );
};
