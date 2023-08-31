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
import type { IDismantle, IDismantleSearchDto } from "@framework/types";
import { DismantleStatus, TokenType } from "@framework/types";

import { DismantleEditDialog } from "./edit";
import { DismantleSearchForm } from "./form";
import { cleanUpAsset, formatItem } from "../../../../utils/money";

export const Dismantle: FC = () => {
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
  } = useCollection<IDismantle, IDismantleSearchDto>({
    baseUrl: "/dismantle",
    empty: {
      price: getEmptyTemplate(TokenType.ERC721),
      item: getEmptyTemplate(TokenType.ERC1155),
    },
    search: {
      query: "",
      dismantleStatus: [DismantleStatus.ACTIVE],
    },
    filter: ({ item, price, dismantleStatus }) => ({
      item: cleanUpAsset(item),
      price: cleanUpAsset(price),
      dismantleStatus,
    }),
  });

  return (
    <Grid>
      <Breadcrumbs path={["dashboard", "dismantle"]} />

      <PageHeader message="pages.dismantle.title">
        <Button startIcon={<FilterList />} onClick={handleToggleFilters} data-testid="ToggleFilterButton">
          <FormattedMessage
            id={`form.buttons.${isFiltersOpen ? "hideFilters" : "showFilters"}`}
            data-testid="ToggleFiltersButton"
          />
        </Button>
        <Button variant="outlined" startIcon={<Add />} onClick={handleCreate} data-testid="DismantleCreateButton">
          <FormattedMessage id="form.buttons.create" />
        </Button>
      </PageHeader>

      <DismantleSearchForm onSubmit={handleSearch} initialValues={search} open={isFiltersOpen} />

      <ProgressOverlay isLoading={isLoading}>
        <List>
          {rows.map((dismantle, i) => (
            <ListItem key={i} sx={{ flexWrap: "wrap" }}>
              <ListItemText sx={{ width: 0.6 }}>{formatItem(dismantle.item)}</ListItemText>
              <ListItemSecondaryAction>
                <IconButton onClick={handleEdit(dismantle)}>
                  <Create />
                </IconButton>
                <IconButton onClick={handleDelete(dismantle)}>
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

      <DismantleEditDialog
        onCancel={handleEditCancel}
        onConfirm={handleEditConfirm}
        open={isEditDialogOpen}
        initialValues={selected}
      />
    </Grid>
  );
};
