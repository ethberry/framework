import { FC } from "react";
import { FormattedMessage } from "react-intl";
import { Button, Grid, ListItemText } from "@mui/material";
import { Add, Create, Delete, FilterList } from "@mui/icons-material";
import { useWeb3React } from "@web3-react/core";

import { Breadcrumbs, PageHeader } from "@ethberry/mui-page-layout";
import { DeleteDialog } from "@ethberry/mui-dialog-delete";
import { CollectionActions, useCollection } from "@ethberry/provider-collection";
import { emptyStateString } from "@ethberry/draft-js-utils";
import { emptyPrice } from "@ethberry/mui-inputs-asset";
import { cleanUpAsset } from "@framework/exchange";
import { ListAction, ListActions, ListItem, StyledPagination } from "@framework/styled";
import type { ITemplate, ITemplateSearchDto, IToken } from "@framework/types";
import { ModuleType, TemplateStatus, TokenType } from "@framework/types";

import { TemplateSearchForm } from "../../../../components/forms/template-search";
import {
  ContractAllowanceButton,
  TemplateMintButton,
  TokenRoyaltyButton,
  TransferButton,
} from "../../../../components/buttons";
import { WithCheckPermissionsListWrapper } from "../../../../components/wrappers";
import { Erc1155TemplateEditDialog } from "./edit";

export const Erc1155Template: FC = () => {
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
  } = useCollection<ITemplate, ITemplateSearchDto>({
    baseUrl: "/erc1155/templates",
    empty: {
      title: "",
      description: emptyStateString,
      price: emptyPrice,
      amount: "0",
    },
    search: {
      query: "",
      contractIds: [],
      templateStatus: [TemplateStatus.ACTIVE],
    },
    filter: ({ id, title, description, price, amount, imageUrl, contractId, templateStatus }) =>
      id
        ? { title, description, price: cleanUpAsset(price), amount, imageUrl, templateStatus }
        : { title, description, price: cleanUpAsset(price), amount, imageUrl, contractId },
  });

  const { account = "" } = useWeb3React();

  return (
    <Grid>
      <Breadcrumbs path={["dashboard", "erc1155", "erc1155.templates"]} />

      <PageHeader message="pages.erc1155.templates.title">
        <Button startIcon={<FilterList />} onClick={handleToggleFilters} data-testid="ToggleFilterButton">
          <FormattedMessage id={`form.buttons.${isFiltersOpen ? "hideFilters" : "showFilters"}`} />
        </Button>
        <Button variant="outlined" startIcon={<Add />} onClick={handleCreate} data-testid="Erc1155TemplateCreateButton">
          <FormattedMessage id="form.buttons.create" />
        </Button>
      </PageHeader>

      <TemplateSearchForm
        onSubmit={handleSearch}
        initialValues={search}
        open={isFiltersOpen}
        contractType={[TokenType.ERC1155]}
        contractModule={[ModuleType.HIERARCHY]}
      />

      <WithCheckPermissionsListWrapper isLoading={isLoading} count={rows.length}>
        {rows.map(template => (
          <ListItem key={template.id} wrap account={account} contract={template.contract}>
            <ListItemText sx={{ width: 0.6 }}>{template.title}</ListItemText>
            <ListItemText sx={{ width: { xs: 0.6, md: 0.2 } }}>{template.contract?.title}</ListItemText>
            <ListActions dataTestId="TemplateActionsMenuButton">
              <ListAction
                onClick={handleEdit(template)}
                message="form.buttons.edit"
                dataTestId="TemplateEditButton"
                icon={Create}
              />
              <ListAction
                onClick={handleDelete(template)}
                message="form.buttons.delete"
                dataTestId="TemplateDeleteButton"
                icon={Delete}
                disabled={template.templateStatus === TemplateStatus.INACTIVE}
              />
              <TemplateMintButton template={template} />
              <TokenRoyaltyButton token={{ ...template.tokens![0], template } as unknown as IToken} />
              <ContractAllowanceButton contract={template.contract!} />
              <TransferButton contract={template.contract!} />
            </ListActions>
          </ListItem>
        ))}
      </WithCheckPermissionsListWrapper>

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

      <Erc1155TemplateEditDialog
        onCancel={handleEditCancel}
        onConfirm={handleEditConfirm}
        open={action === CollectionActions.edit}
        initialValues={selected}
      />
    </Grid>
  );
};
