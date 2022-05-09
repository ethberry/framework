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
import { constants } from "ethers";

import { Breadcrumbs, PageHeader, ProgressOverlay } from "@gemunion/mui-page-layout";
import { DeleteDialog } from "@gemunion/mui-dialog-delete";
import { useCollection } from "@gemunion/react-hooks";
import { emptyStateString } from "@gemunion/draft-js-utils";
import { Erc721TemplateStatus, IErc721Template, IErc721TemplateSearchDto } from "@framework/types";

import { Erc721TemplateEditDialog } from "./edit";
import { Erc721TemplateSearchForm } from "./form";

export const Erc721Template: FC = () => {
  const {
    rows,
    count,
    search,
    selected,
    isLoading,
    isFiltersOpen,
    isEditDialogOpen,
    isDeleteDialogOpen,
    handleAdd,
    handleToggleFilters,
    handleEdit,
    handleEditCancel,
    handleEditConfirm,
    handleDelete,
    handleDeleteCancel,
    handleSubmit,
    handleChangePage,
    handleDeleteConfirm,
  } = useCollection<IErc721Template, IErc721TemplateSearchDto>({
    baseUrl: "/erc721-templates",
    empty: {
      title: "",
      description: emptyStateString,
      price: constants.WeiPerEther.toString(),
      attributes: "{}",
      amount: 0,
      erc721CollectionId: 3,
    },
    search: {
      query: "",
      templateStatus: [Erc721TemplateStatus.ACTIVE],
      erc721CollectionIds: [],
    },
    filter: ({ title, description, attributes, price, amount, imageUrl, templateStatus, erc721CollectionId }) => ({
      title,
      description,
      attributes,
      price,
      amount,
      imageUrl,
      templateStatus,
      erc721CollectionId,
    }),
  });

  return (
    <Grid>
      <Breadcrumbs path={["dashboard", "erc721-templates"]} />

      <PageHeader message="pages.erc721-templates.title">
        <Button startIcon={<FilterList />} onClick={handleToggleFilters}>
          <FormattedMessage
            id={`form.buttons.${isFiltersOpen ? "hideFilters" : "showFilters"}`}
            data-testid="ToggleFiltersButton"
          />
        </Button>
        <Button variant="outlined" startIcon={<Add />} onClick={handleAdd} data-testid="erc721TemplateAddButton">
          <FormattedMessage id="form.buttons.add" />
        </Button>
      </PageHeader>

      <Erc721TemplateSearchForm onSubmit={handleSubmit} initialValues={search} open={isFiltersOpen} />

      <ProgressOverlay isLoading={isLoading}>
        <List>
          {rows.map((template, i) => (
            <ListItem key={i}>
              <ListItemText>{template.title}</ListItemText>
              <ListItemSecondaryAction>
                <IconButton onClick={handleEdit(template)}>
                  <Create />
                </IconButton>
                <IconButton onClick={handleDelete(template)}>
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

      <Erc721TemplateEditDialog
        onCancel={handleEditCancel}
        onConfirm={handleEditConfirm}
        open={isEditDialogOpen}
        initialValues={selected}
      />
    </Grid>
  );
};
