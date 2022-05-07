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
import { IErc1155Token, IErc1155TokenSearchDto } from "@framework/types";
import { useCollection } from "@gemunion/react-hooks";

import { Erc1155TokenEditDialog } from "./edit";
import { Erc1155TokenSearchForm } from "./form";

export const Erc1155Token: FC = () => {
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
  } = useCollection<IErc1155Token, IErc1155TokenSearchDto>({
    baseUrl: "/erc1155-tokens",
    empty: {
      title: "",
      description: "",
      price: constants.WeiPerEther.toString(),
      attributes: "{}",
    },
    search: {
      query: "",
      tokenId: "",
      erc1155CollectionIds: [],
    },
    filter: ({ id, title, description, attributes, price, imageUrl, erc1155CollectionId }) =>
      id
        ? { title, description, attributes, price, imageUrl }
        : { title, description, attributes, price, imageUrl, erc1155CollectionId },
  });

  return (
    <Grid>
      <Breadcrumbs path={["dashboard", "erc1155-tokens"]} />

      <PageHeader message="pages.erc1155-tokens.title">
        <Button startIcon={<FilterList />} onClick={handleToggleFilters}>
          <FormattedMessage
            id={`form.buttons.${isFiltersOpen ? "hideFilters" : "showFilters"}`}
            data-testid="ToggleFiltersButton"
          />
        </Button>
        <Button variant="outlined" startIcon={<Add />} onClick={handleAdd} data-testid="erc1155TokenAddButton">
          <FormattedMessage id="form.buttons.add" />
        </Button>
      </PageHeader>

      <Erc1155TokenSearchForm onSubmit={handleSubmit} initialValues={search} open={isFiltersOpen} />

      <ProgressOverlay isLoading={isLoading}>
        <List>
          {rows.map((token, i) => (
            <ListItem key={i}>
              <ListItemText>{token.title}</ListItemText>
              <ListItemSecondaryAction>
                <IconButton onClick={handleEdit(token)}>
                  <Create />
                </IconButton>
                <IconButton onClick={handleDelete(token)}>
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
