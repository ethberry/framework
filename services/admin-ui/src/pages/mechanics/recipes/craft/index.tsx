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
import { Add, Create, Delete, FilterList } from "@mui/icons-material";

import { SelectInput } from "@gemunion/mui-inputs-core";
import { CommonSearchForm } from "@gemunion/mui-form-search";
import { Breadcrumbs, PageHeader, ProgressOverlay } from "@gemunion/mui-page-layout";
import { DeleteDialog } from "@gemunion/mui-dialog-delete";
import { useCollection } from "@gemunion/react-hooks";
import { getEmptyTemplate } from "@gemunion/mui-inputs-asset";
import type { ICraft, ICraftSearchDto } from "@framework/types";
import { CraftStatus, TokenType } from "@framework/types";

import { CraftEditDialog } from "./edit";
import { cleanUpAsset, formatItem } from "../../../../utils/money";

export const Craft: FC = () => {
  const {
    rows,
    count,
    search,
    selected,
    isLoading,
    isFiltersOpen,
    isEditDialogOpen,
    isDeleteDialogOpen,
    handleCreate,
    handleToggleFilters,
    handleEdit,
    handleEditCancel,
    handleEditConfirm,
    handleDelete,
    handleDeleteCancel,
    handleSearch,
    handleChangePage,
    handleDeleteConfirm,
  } = useCollection<ICraft, ICraftSearchDto>({
    baseUrl: "/craft",
    empty: {
      item: getEmptyTemplate(TokenType.ERC721),
      price: getEmptyTemplate(TokenType.ERC1155),
    },
    search: {
      query: "",
      craftStatus: [CraftStatus.ACTIVE],
    },
    filter: ({ item, price, craftStatus }) => ({
      item: cleanUpAsset(item),
      price: cleanUpAsset(price),
      craftStatus,
    }),
  });

  return (
    <Grid>
      <Breadcrumbs path={["dashboard", "craft"]} />

      <PageHeader message="pages.craft.title">
        <Button startIcon={<FilterList />} onClick={handleToggleFilters} data-testid="ToggleFilterButton">
          <FormattedMessage
            id={`form.buttons.${isFiltersOpen ? "hideFilters" : "showFilters"}`}
            data-testid="ToggleFiltersButton"
          />
        </Button>
        <Button variant="outlined" startIcon={<Add />} onClick={handleCreate} data-testid="CraftCreateButton">
          <FormattedMessage id="form.buttons.create" />
        </Button>
      </PageHeader>

      <CommonSearchForm onSubmit={handleSearch} initialValues={search} open={isFiltersOpen} testId="ExchangeSearchForm">
        <Grid container spacing={2} alignItems="flex-end">
          <Grid item xs={12}>
            <SelectInput multiple name="craftStatus" options={CraftStatus} />
          </Grid>
        </Grid>
      </CommonSearchForm>

      <ProgressOverlay isLoading={isLoading}>
        <List>
          {rows.map(craft => (
            <ListItem key={craft.id} sx={{ flexWrap: "wrap" }}>
              <ListItemText sx={{ width: 0.3 }}>{formatItem(craft.price)}</ListItemText>
              <ListItemText sx={{ width: 0.3 }}>{formatItem(craft.item)}</ListItemText>
              <ListItemSecondaryAction>
                <IconButton onClick={handleEdit(craft)}>
                  <Create />
                </IconButton>
                <IconButton onClick={handleDelete(craft)}>
                  <Delete />
                </IconButton>
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
        initialValues={{ ...selected, title: selected.item?.components[0]?.template?.title }}
      />

      <CraftEditDialog
        onCancel={handleEditCancel}
        onConfirm={handleEditConfirm}
        open={isEditDialogOpen}
        initialValues={selected}
      />
    </Grid>
  );
};
