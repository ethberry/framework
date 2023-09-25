import { FC } from "react";
import { FormattedMessage } from "react-intl";
import { Button, Grid, List, ListItem, ListItemText } from "@mui/material";
import { Add, Create, Delete, FilterList } from "@mui/icons-material";

import { Breadcrumbs, PageHeader, ProgressOverlay } from "@gemunion/mui-page-layout";
import { DeleteDialog } from "@gemunion/mui-dialog-delete";
import { useCollection } from "@gemunion/react-hooks";
import { emptyStateString } from "@gemunion/draft-js-utils";
import { emptyPrice } from "@gemunion/mui-inputs-asset";
import { ListAction, ListActions } from "@framework/mui-lists";
import { StyledPagination } from "@framework/styled";
import type { ITemplate, ITemplateSearchDto } from "@framework/types";
import { ContractFeatures, ModuleType, TemplateStatus, TokenType } from "@framework/types";

import { TemplateSearchForm } from "../../../../components/forms/template-search";
import { MintButton } from "../../../../components/buttons/hierarchy/template/mint";
import { cleanUpAsset } from "../../../../utils/money";
import { CollectionTemplateEditDialog } from "./edit";

export const CollectionTemplate: FC = () => {
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
    handleRefreshPage,
  } = useCollection<ITemplate, ITemplateSearchDto>({
    baseUrl: "/collection/templates",
    empty: {
      title: "",
      description: emptyStateString,
      price: emptyPrice,
      amount: "0",
      contractId: 3,
    },
    search: {
      query: "",
      templateStatus: [],
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
      <Breadcrumbs path={["dashboard", "collection", "collection.template"]} />

      <PageHeader message="pages.collection.templates">
        <Button startIcon={<FilterList />} onClick={handleToggleFilters} data-testid="ToggleFilterButton">
          <FormattedMessage
            id={`form.buttons.${isFiltersOpen ? "hideFilters" : "showFilters"}`}
            data-testid="ToggleFiltersButton"
          />
        </Button>
        <Button
          variant="outlined"
          startIcon={<Add />}
          onClick={handleCreate}
          data-testid="CollectionTemplateCreateButton"
          disabled
        >
          <FormattedMessage id="form.buttons.create" />
        </Button>
      </PageHeader>

      <TemplateSearchForm
        onSubmit={handleSearch}
        initialValues={search}
        open={isFiltersOpen}
        contractType={[TokenType.ERC721]}
        contractModule={[ModuleType.COLLECTION]}
        onRefreshPage={handleRefreshPage}
      />

      <ProgressOverlay isLoading={isLoading}>
        <List>
          {rows.map(template => (
            <ListItem key={template.id} sx={{ flexWrap: "wrap" }}>
              <ListItemText sx={{ width: 0.6 }}>{template.title}</ListItemText>
              <ListItemText sx={{ width: { xs: 0.6, md: 0.2 } }}>{template.contract?.title}</ListItemText>
              <ListActions dataTestId="TemplateActionsMenuButton">
                <ListAction onClick={handleEdit(template)} icon={Create} message="form.buttons.edit" />
                <ListAction
                  onClick={handleDelete(template)}
                  disabled={template.templateStatus === TemplateStatus.INACTIVE}
                  icon={Delete}
                  message="form.buttons.delete"
                />
                <MintButton
                  template={template}
                  disabled={
                    template.templateStatus === TemplateStatus.INACTIVE ||
                    template.contract?.contractType === TokenType.NATIVE ||
                    template.contract?.contractFeatures.includes(ContractFeatures.GENES)
                  }
                />
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

      <CollectionTemplateEditDialog
        onCancel={handleEditCancel}
        onConfirm={handleEditConfirm}
        open={isEditDialogOpen}
        initialValues={selected}
      />
    </Grid>
  );
};
