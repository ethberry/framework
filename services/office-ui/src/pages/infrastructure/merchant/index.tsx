import { FC } from "react";
import { FormattedMessage } from "react-intl";
import { Button, Grid, List, ListItem, ListItemText } from "@mui/material";
import { Create, Delete, FilterList } from "@mui/icons-material";

import { SelectInput } from "@gemunion/mui-inputs-core";
import { CommonSearchForm } from "@gemunion/mui-form-search";
import { emptyStateString } from "@gemunion/draft-js-utils";
import { Breadcrumbs, PageHeader, ProgressOverlay } from "@gemunion/mui-page-layout";
import { DeleteDialog } from "@gemunion/mui-dialog-delete";
import { useCollection } from "@gemunion/react-hooks";
import { ListAction, ListActions } from "@framework/mui-lists";
import { StyledPagination } from "@framework/styled";
import type { IMerchant, IMerchantSearchDto } from "@framework/types";
import { MerchantStatus } from "@framework/types";

import { EditMerchantDialog } from "./edit";

export const Merchant: FC = () => {
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
  } = useCollection<IMerchant, IMerchantSearchDto>({
    baseUrl: "/merchants",
    empty: {
      title: "",
      description: emptyStateString,
    },
    search: {
      query: "",
      merchantStatus: [MerchantStatus.ACTIVE],
    },
  });

  return (
    <Grid>
      <Breadcrumbs path={["dashboard", "merchants"]} />

      <PageHeader message="pages.merchants.title">
        <Button startIcon={<FilterList />} onClick={handleToggleFilters}>
          <FormattedMessage id={`form.buttons.${isFiltersOpen ? "hideFilters" : "showFilters"}`} />
        </Button>
      </PageHeader>

      <CommonSearchForm onSubmit={handleSearch} initialValues={search} open={isFiltersOpen} testId="MerchantSearchForm">
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <SelectInput multiple name="merchantStatus" options={MerchantStatus} />
          </Grid>
        </Grid>
      </CommonSearchForm>

      <ProgressOverlay isLoading={isLoading}>
        <List>
          {rows.map(merchant => (
            <ListItem key={merchant.id}>
              <ListItemText>{merchant.title}</ListItemText>
              <ListActions>
                <ListAction onClick={handleEdit(merchant)} message="form.buttons.edit" icon={Create} />
                <ListAction onClick={handleDelete(merchant)} message="form.buttons.delete" icon={Delete} />
              </ListActions>
            </ListItem>
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

      <EditMerchantDialog
        onCancel={handleEditCancel}
        onConfirm={handleEditConfirm}
        open={isEditDialogOpen}
        initialValues={selected}
      />
    </Grid>
  );
};
