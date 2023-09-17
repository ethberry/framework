import { FC } from "react";
import { FormattedMessage } from "react-intl";

import { Button, Grid, List, ListItem, ListItemText, Pagination } from "@mui/material";
import { Add, Create, FilterList } from "@mui/icons-material";

import { EntityInput } from "@gemunion/mui-inputs-entity";
import { SelectInput } from "@gemunion/mui-inputs-core";
import { CommonSearchForm } from "@gemunion/mui-form-search";
import { Breadcrumbs, PageHeader, ProgressOverlay } from "@gemunion/mui-page-layout";
import { useCollection } from "@gemunion/react-hooks";
import { getEmptyTemplate } from "@gemunion/mui-inputs-asset";
import type { IRent } from "@framework/types";
import { ContractFeatures, IRentSearchDto, RentRuleStatus, TokenType } from "@framework/types";

import { cleanUpAsset } from "../../../../utils/money";
import { ListAction, ListActions } from "../../../../components/common/lists";
import { RentEditDialog } from "./edit";

export const Rent: FC = () => {
  const {
    rows,
    count,
    search,
    selected,
    isLoading,
    isFiltersOpen,
    isEditDialogOpen,
    handleCreate,
    handleEdit,
    handleEditCancel,
    handleEditConfirm,
    handleSearch,
    handleToggleFilters,
    handleChangePage,
  } = useCollection<IRent, IRentSearchDto>({
    baseUrl: "/rents",
    empty: {
      price: getEmptyTemplate(TokenType.ERC20),
      title: "",
      contractId: 0,
      rentStatus: RentRuleStatus.NEW,
    },
    search: {
      query: "",
      contractIds: [],
      rentStatus: [RentRuleStatus.ACTIVE, RentRuleStatus.NEW],
    },
    filter: ({ price, contractId, title, rentStatus }) => ({
      price: cleanUpAsset(price),
      contractId,
      title,
      rentStatus,
    }),
  });

  return (
    <Grid>
      <Breadcrumbs path={["dashboard", "rent"]} />

      <PageHeader message="pages.rent.title">
        <Button startIcon={<FilterList />} onClick={handleToggleFilters} data-testid="ToggleFilterButton">
          <FormattedMessage
            id={`form.buttons.${isFiltersOpen ? "hideFilters" : "showFilters"}`}
            data-testid="ToggleFiltersButton"
          />
        </Button>
        <Button variant="outlined" startIcon={<Add />} onClick={handleCreate} data-testid="ExchangeCreateButton">
          <FormattedMessage id="form.buttons.create" />
        </Button>
      </PageHeader>

      <CommonSearchForm onSubmit={handleSearch} initialValues={search} open={isFiltersOpen} testId="RentSearchForm">
        <Grid container spacing={2} alignItems="flex-end">
          <Grid item xs={6}>
            <EntityInput
              name="contractIds"
              controller="contracts"
              multiple
              data={{ contractFeatures: [ContractFeatures.RENTABLE] }}
            />
          </Grid>
          <Grid item xs={6}>
            <SelectInput multiple name="rentStatus" options={RentRuleStatus} />
          </Grid>
        </Grid>
      </CommonSearchForm>

      <ProgressOverlay isLoading={isLoading}>
        <List>
          {rows.map(rent => (
            <ListItem key={rent.id}>
              <ListItemText sx={{ width: 0.5 }}>{rent.title}</ListItemText>
              <ListItemText sx={{ width: 0.5 }}>{rent.contract?.title}</ListItemText>
              <ListActions>
                <ListAction onClick={handleEdit(rent)} icon={Create} message="form.buttons.edit" />
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

      <RentEditDialog
        onCancel={handleEditCancel}
        onConfirm={handleEditConfirm}
        open={isEditDialogOpen}
        initialValues={selected}
      />
    </Grid>
  );
};
