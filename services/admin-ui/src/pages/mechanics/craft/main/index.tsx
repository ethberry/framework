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

import { Breadcrumbs, PageHeader, ProgressOverlay } from "@gemunion/mui-page-layout";
import { DeleteDialog } from "@gemunion/mui-dialog-delete";
import { useCollection } from "@gemunion/react-hooks";
import { getEmptyTemplate } from "@gemunion/mui-inputs-asset";
import type { ICraft, ICraftSearchDto } from "@framework/types";
import { CraftStatus, TokenType } from "@framework/types";

import { CraftEditDialog } from "./edit";
import { ExchangeSearchForm } from "./form";
import { cleanUpAsset } from "../../../../utils/money";

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
      item: getEmptyTemplate(TokenType.ERC721) as any,
      price: getEmptyTemplate(TokenType.ERC1155) as any,
    },
    search: {
      query: "",
      craftStatus: [CraftStatus.ACTIVE, CraftStatus.NEW],
    },
    filter: ({ item, price, craftStatus }) => ({
      craftStatus,
      item: cleanUpAsset(item),
      price: cleanUpAsset(price),
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
        <Button variant="outlined" startIcon={<Add />} onClick={handleCreate} data-testid="ExchangeCreateButton">
          <FormattedMessage id="form.buttons.create" />
        </Button>
      </PageHeader>

      <ExchangeSearchForm onSubmit={handleSearch} initialValues={search} open={isFiltersOpen} />

      <ProgressOverlay isLoading={isLoading}>
        <List>
          {rows.map((craft, i) => (
            <ListItem key={i} sx={{ flexWrap: "wrap" }}>
              <ListItemText sx={{ width: 0.6 }}>{craft.item?.components[0].template?.title}</ListItemText>
              <ListItemText sx={{ width: { xs: 0.6, md: 0.2 } }}>
                {craft.item?.components[0].contract?.title}
              </ListItemText>
              <ListItemSecondaryAction>
                <IconButton onClick={handleEdit(craft)}>
                  <Create />
                </IconButton>
                <IconButton onClick={handleDelete(craft)} disabled={craft.craftStatus !== CraftStatus.NEW}>
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
