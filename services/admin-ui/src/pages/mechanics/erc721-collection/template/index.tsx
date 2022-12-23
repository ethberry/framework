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
import { emptyPrice } from "@gemunion/mui-inputs-asset";
import { ITemplate, ITemplateSearchDto, TemplateStatus, TokenType } from "@framework/types";

import { Erc721TemplateEditDialog } from "./edit";
import { TemplateSearchForm } from "../../../../components/forms/template-search";
import { cleanUpAsset } from "../../../../utils/money";
import { TemplateActionsMenu } from "../../../../components/menu/template";

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
  } = useCollection<ITemplate, ITemplateSearchDto>({
    baseUrl: "/erc721-templates",
    empty: {
      title: "",
      description: emptyStateString,
      price: emptyPrice as any,
      amount: "0",
      contractId: 3,
    },
    search: {
      query: "",
      templateStatus: [TemplateStatus.ACTIVE],
      contractIds: [],
    },
    filter: ({ id, title, description, price, amount, imageUrl, templateStatus, contractId }) =>
      id
        ? {
            title,
            description,
            price: cleanUpAsset(price),
            amount,
            imageUrl,
            templateStatus,
          }
        : {
            title,
            description,
            price: cleanUpAsset(price),
            amount,
            imageUrl,
            contractId,
          },
  });

  return (
    <Grid>
      <Breadcrumbs path={["dashboard", "erc721.templates"]} />

      <PageHeader message="pages.erc721.templates.title">
        <Button startIcon={<FilterList />} onClick={handleToggleFilters} data-testid="ToggleFilterButton">
          <FormattedMessage
            id={`form.buttons.${isFiltersOpen ? "hideFilters" : "showFilters"}`}
            data-testid="ToggleFiltersButton"
          />
        </Button>
        <Button variant="outlined" startIcon={<Add />} onClick={handleCreate} data-testid="Erc721TemplateCreateButton">
          <FormattedMessage id="form.buttons.create" />
        </Button>
      </PageHeader>

      <TemplateSearchForm
        onSubmit={handleSearch}
        initialValues={search}
        open={isFiltersOpen}
        contractType={[TokenType.ERC721]}
      />

      <ProgressOverlay isLoading={isLoading}>
        <List>
          {rows.map((template, i) => (
            <ListItem key={i} sx={{ flexWrap: "wrap" }}>
              <ListItemText sx={{ width: 0.6 }}>{template.title}</ListItemText>
              <ListItemText sx={{ width: { xs: 0.6, md: 0.2 } }}>{template.contract?.title}</ListItemText>
              <ListItemSecondaryAction>
                <IconButton onClick={handleEdit(template)}>
                  <Create />
                </IconButton>
                <IconButton
                  onClick={handleDelete(template)}
                  disabled={template.templateStatus === TemplateStatus.INACTIVE}
                >
                  <Delete />
                </IconButton>
                <TemplateActionsMenu
                  template={template}
                  disabled={template.templateStatus === TemplateStatus.INACTIVE}
                />
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
