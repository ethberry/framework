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
import { IMerchant, IMerchantSearchDto, MerchantStatus } from "@framework/types";
import { useCollection } from "@gemunion/react-hooks";

import { EditMerchantDialog } from "./edit";
import { MerchantSearchForm } from "./form";

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

      <MerchantSearchForm onSubmit={handleSearch} initialValues={search} open={isFiltersOpen} />

      <ProgressOverlay isLoading={isLoading}>
        <List>
          {rows.map((merchant, i) => (
            <ListItem key={i}>
              <ListItemText>{merchant.title}</ListItemText>
              <ListItemSecondaryAction>
                <IconButton onClick={handleEdit(merchant)}>
                  <Create />
                </IconButton>
                <IconButton onClick={handleDelete(merchant)}>
                  <Delete />
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
          ))}
        </List>
      </ProgressOverlay>

      <Pagination
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
