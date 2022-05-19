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
import { Erc721AirdropStatus, IErc721Airdrop, IErc721AirdropSearchDto } from "@framework/types";
import { useCollection } from "@gemunion/react-hooks";

import { Erc721AirdropEditDialog } from "./edit";
import { Erc721AirdropSearchForm } from "./form";

export const Erc721Airdrop: FC = () => {
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
  } = useCollection<IErc721Airdrop, IErc721AirdropSearchDto>({
    baseUrl: "/erc721-airdrops",
    empty: {
      owner: "",
      erc721TemplateId: 1,
    },
    search: {
      query: "",
      airdropStatus: [],
      erc721TemplateIds: [],
    },
    filter: ({ id, owner, erc721TemplateId, list }: any) => (id ? { owner, erc721TemplateId } : { list }),
  });

  return (
    <Grid>
      <Breadcrumbs path={["dashboard", "erc721-airdrops"]} />

      <PageHeader message="pages.erc721-airdrops.title">
        <Button startIcon={<FilterList />} onClick={handleToggleFilters}>
          <FormattedMessage
            id={`form.buttons.${isFiltersOpen ? "hideFilters" : "showFilters"}`}
            data-testid="ToggleFiltersButton"
          />
        </Button>
        <Button variant="outlined" startIcon={<Add />} onClick={handleAdd} data-testid="erc721AirdropAddButton">
          <FormattedMessage id="form.buttons.add" />
        </Button>
      </PageHeader>

      <Erc721AirdropSearchForm onSubmit={handleSubmit} initialValues={search} open={isFiltersOpen} />

      <ProgressOverlay isLoading={isLoading}>
        <List>
          {rows.map((airdrop, i) => (
            <ListItem key={i}>
              <ListItemText>{airdrop.owner}</ListItemText>
              <ListItemText>{airdrop.erc721Template!.title}</ListItemText>
              <ListItemSecondaryAction>
                <IconButton onClick={handleEdit(airdrop)} disabled={airdrop.airdropStatus !== Erc721AirdropStatus.NEW}>
                  <Create />
                </IconButton>
                <IconButton
                  onClick={handleDelete(airdrop)}
                  disabled={airdrop.airdropStatus !== Erc721AirdropStatus.NEW}
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

      <Erc721AirdropEditDialog
        onCancel={handleEditCancel}
        onConfirm={handleEditConfirm}
        open={isEditDialogOpen}
        initialValues={selected}
      />
    </Grid>
  );
};
