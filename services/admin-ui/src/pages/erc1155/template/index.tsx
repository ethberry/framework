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
import { IErc1155TemplateSearchDto, IUniTemplate, UniTemplateStatus } from "@framework/types";

import { Erc1155TokenEditDialog } from "./edit";
import { Erc1155TemplateSearchForm } from "./form";
import { emptyPrice } from "../../../components/inputs/empty-price";

export const Erc1155Template: FC = () => {
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
  } = useCollection<IUniTemplate, IErc1155TemplateSearchDto>({
    baseUrl: "/erc1155-templates",
    empty: {
      title: "",
      description: emptyStateString,
      price: emptyPrice,
      attributes: "{}",
      amount: "0",
    },
    search: {
      query: "",
      uniContractIds: [],
      templateStatus: [UniTemplateStatus.ACTIVE],
    },
    filter: ({ id, title, description, attributes, price, amount, imageUrl, uniContractId, templateStatus }) =>
      id
        ? { title, description, attributes, price, amount, imageUrl, templateStatus }
        : { title, description, attributes, price, amount, imageUrl, uniContractId },
  });

  return (
    <Grid>
      <Breadcrumbs path={["dashboard", "erc1155-templates"]} />

      <PageHeader message="pages.erc1155-templates.title">
        <Button startIcon={<FilterList />} onClick={handleToggleFilters} data-testid="ToggleFilterButton">
          <FormattedMessage
            id={`form.buttons.${isFiltersOpen ? "hideFilters" : "showFilters"}`}
            data-testid="ToggleFiltersButton"
          />
        </Button>
        <Button variant="outlined" startIcon={<Add />} onClick={handleCreate} data-testid="Erc1155TokenCreateButton">
          <FormattedMessage id="form.buttons.create" />
        </Button>
      </PageHeader>

      <Erc1155TemplateSearchForm onSubmit={handleSearch} initialValues={search} open={isFiltersOpen} />

      <ProgressOverlay isLoading={isLoading}>
        <List>
          {rows.map((token, i) => (
            <ListItem key={i}>
              <ListItemText>{token.title}</ListItemText>
              <ListItemSecondaryAction>
                <IconButton onClick={handleEdit(token)}>
                  <Create />
                </IconButton>
                <IconButton
                  onClick={handleDelete(token)}
                  disabled={token.templateStatus === UniTemplateStatus.INACTIVE}
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

      <Erc1155TokenEditDialog
        onCancel={handleEditCancel}
        onConfirm={handleEditConfirm}
        open={isEditDialogOpen}
        initialValues={selected}
      />
    </Grid>
  );
};
