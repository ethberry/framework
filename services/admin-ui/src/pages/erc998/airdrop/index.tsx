import { FC } from "react";
import { FormattedMessage, useIntl } from "react-intl";
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
import { Erc998AirdropStatus, IErc998Airdrop, IErc998AirdropSearchDto } from "@framework/types";
import { useCollection } from "@gemunion/react-hooks";

import { Erc998AirdropEditDialog } from "./edit";
import { Erc998AirdropSearchForm } from "./form";

export const Erc998Airdrop: FC = () => {
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
  } = useCollection<IErc998Airdrop, IErc998AirdropSearchDto>({
    baseUrl: "/erc998-airdrops",
    empty: {
      owner: "",
      erc998TemplateId: 1,
    },
    search: {
      query: "",
      airdropStatus: [],
      erc998TemplateIds: [],
    },
    filter: ({ id, owner, erc998TemplateId, list }: any) => (id ? { owner, erc998TemplateId } : { list }),
  });

  const { formatMessage } = useIntl();

  return (
    <Grid>
      <Breadcrumbs path={["dashboard", "erc998-airdrops"]} />

      <PageHeader message="pages.erc998-airdrops.title">
        <Button startIcon={<FilterList />} onClick={handleToggleFilters} data-testid="ToggleFilterButton">
          <FormattedMessage
            id={`form.buttons.${isFiltersOpen ? "hideFilters" : "showFilters"}`}
            data-testid="ToggleFiltersButton"
          />
        </Button>
        <Button variant="outlined" startIcon={<Add />} onClick={handleCreate} data-testid="Erc998AirdropCreateButton">
          <FormattedMessage id="form.buttons.create" />
        </Button>
      </PageHeader>

      <Erc998AirdropSearchForm onSubmit={handleSearch} initialValues={search} open={isFiltersOpen} />

      <ProgressOverlay isLoading={isLoading}>
        <List>
          {rows.map((airdrop, i) => (
            <ListItem key={i}>
              <ListItemText>{airdrop.owner}</ListItemText>
              <ListItemText>{airdrop.erc998Template!.title}</ListItemText>
              <ListItemSecondaryAction>
                <IconButton onClick={handleEdit(airdrop)} disabled={airdrop.airdropStatus !== Erc998AirdropStatus.NEW}>
                  <Create />
                </IconButton>
                <IconButton
                  onClick={handleDelete(airdrop)}
                  disabled={airdrop.airdropStatus !== Erc998AirdropStatus.NEW}
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
        initialValues={{ ...selected, title: formatMessage({ id: "pages.erc998-airdrops.defaultItemTitle" }) }}
      />

      <Erc998AirdropEditDialog
        onCancel={handleEditCancel}
        onConfirm={handleEditConfirm}
        open={isEditDialogOpen}
        initialValues={selected}
      />
    </Grid>
  );
};
