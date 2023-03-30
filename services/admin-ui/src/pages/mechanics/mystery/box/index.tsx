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
import { emptyStateString } from "@gemunion/draft-js-utils";
import { emptyItem, emptyPrice } from "@gemunion/mui-inputs-asset";
import { IMysterybox, IMysteryBoxSearchDto, ITemplate, MysteryboxStatus } from "@framework/types";

import { MysteryboxEditDialog } from "./edit";
import { MysteryboxSearchForm } from "./form";
import { cleanUpAsset } from "../../../../utils/money";

export const MysteryBox: FC = () => {
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
  } = useCollection<IMysterybox, IMysteryBoxSearchDto>({
    baseUrl: "/mystery-boxes",
    empty: {
      title: "",
      description: emptyStateString,
      item: emptyItem,
      template: {
        price: emptyPrice,
      } as ITemplate,
    },
    search: {
      query: "",
      mysteryboxStatus: [MysteryboxStatus.ACTIVE],
    },
    filter: ({ id, template, title, description, imageUrl, item, mysteryboxStatus }) =>
      id
        ? {
            title,
            description,
            imageUrl,
            item: cleanUpAsset(item),
            price: cleanUpAsset(template?.price),
            mysteryboxStatus,
          }
        : {
            contractId: template?.contractId,
            title,
            description,
            imageUrl,
            item: cleanUpAsset(item),
            price: cleanUpAsset(template?.price),
          },
  });

  return (
    <Grid>
      <Breadcrumbs path={["dashboard", "mystery.boxes"]} />

      <PageHeader message="pages.mystery.boxes.title">
        <Button startIcon={<FilterList />} onClick={handleToggleFilters} data-testid="ToggleFilterButton">
          <FormattedMessage
            id={`form.buttons.${isFiltersOpen ? "hideFilters" : "showFilters"}`}
            data-testid="ToggleFiltersButton"
          />
        </Button>
        <Button variant="outlined" startIcon={<Add />} onClick={handleCreate} data-testid="MysteryBoxCreateButton">
          <FormattedMessage id="form.buttons.create" />
        </Button>
      </PageHeader>

      <MysteryboxSearchForm onSubmit={handleSearch} initialValues={search} open={isFiltersOpen} />

      <ProgressOverlay isLoading={isLoading}>
        <List>
          {rows.map((mystery, i) => (
            <ListItem key={i}>
              <ListItemText>{mystery.title}</ListItemText>
              <ListItemSecondaryAction>
                <IconButton onClick={handleEdit(mystery)}>
                  <Create />
                </IconButton>
                <IconButton
                  onClick={handleDelete(mystery)}
                  disabled={mystery.mysteryboxStatus === MysteryboxStatus.INACTIVE}
                >
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
        initialValues={selected}
      />

      <MysteryboxEditDialog
        onCancel={handleEditCancel}
        onConfirm={handleEditConfirm}
        open={isEditDialogOpen}
        initialValues={selected}
      />
    </Grid>
  );
};
