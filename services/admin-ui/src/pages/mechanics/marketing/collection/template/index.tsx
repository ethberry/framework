import { FC } from "react";
import { FormattedMessage } from "react-intl";
import { Button, Grid, ListItemText } from "@mui/material";
import { Add, Create, Delete, FilterList } from "@mui/icons-material";

import { Breadcrumbs, PageHeader, ProgressOverlay } from "@gemunion/mui-page-layout";
import { DeleteDialog } from "@gemunion/mui-dialog-delete";
import { useCollection, CollectionActions } from "@gemunion/react-hooks";
import { emptyStateString } from "@gemunion/draft-js-utils";
import { emptyPrice } from "@gemunion/mui-inputs-asset";
import { cleanUpAsset } from "@framework/exchange";
import { ListAction, ListActions, StyledListItem, StyledListWrapper, StyledPagination } from "@framework/styled";
import type { ITemplate, ITemplateSearchDto } from "@framework/types";
import { ModuleType, TemplateStatus, TokenType } from "@framework/types";

import { TemplateSearchForm } from "../../../../../components/forms/template-search";
import { TemplateMintButton } from "../../../../../components/buttons";
import { CollectionTemplateEditDialog } from "./edit";

export const CollectionTemplate: FC = () => {
  const {
    rows,
    count,
    search,
    action,
    selected,
    isLoading,
    isFiltersOpen,
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
          <FormattedMessage id={`form.buttons.${isFiltersOpen ? "hideFilters" : "showFilters"}`} />
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
        <StyledListWrapper count={rows.length} isLoading={isLoading}>
          {rows.map(template => (
            <StyledListItem key={template.id} wrap>
              <ListItemText sx={{ width: 0.6 }}>{template.title}</ListItemText>
              <ListItemText sx={{ width: { xs: 0.6, md: 0.2 } }}>{template.contract?.title}</ListItemText>
              <ListActions dataTestId="TemplateActionsMenuButton">
                <ListAction onClick={handleEdit(template)} message="form.buttons.edit" icon={Create} />
                <ListAction
                  onClick={handleDelete(template)}
                  disabled={template.templateStatus === TemplateStatus.INACTIVE}
                  icon={Delete}
                  message="form.buttons.delete"
                />
                <TemplateMintButton template={template} />
              </ListActions>
            </StyledListItem>
          ))}
        </StyledListWrapper>
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
        open={action === CollectionActions.delete}
        initialValues={selected}
      />

      <CollectionTemplateEditDialog
        onCancel={handleEditCancel}
        onConfirm={handleEditConfirm}
        open={action === CollectionActions.edit}
        initialValues={selected}
      />
    </Grid>
  );
};
