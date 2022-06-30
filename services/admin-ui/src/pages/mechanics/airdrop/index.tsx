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
import { AirdropStatus, IAirdrop, IAirdropSearchDto } from "@framework/types";
import { useCollection } from "@gemunion/react-hooks";

import { AirdropEditDialog } from "./edit";
import { AirdropSearchForm } from "./form";
import { emptyPrice } from "../../../components/inputs/empty-price";

export const Airdrop: FC = () => {
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
  } = useCollection<IAirdrop, IAirdropSearchDto>({
    baseUrl: "/airdrops",
    empty: {
      account: "",
      item: emptyPrice,
    },
    search: {
      account: "",
      airdropStatus: [],
      templateIds: [],
    },
    filter: ({ id, owner, templateIds, list }: any) => (id ? { owner, templateIds } : { list }),
  });

  const { formatMessage } = useIntl();

  return (
    <Grid>
      <Breadcrumbs path={["dashboard", "airdrops"]} />

      <PageHeader message="pages.airdrops.title">
        <Button startIcon={<FilterList />} onClick={handleToggleFilters} data-testid="ToggleFilterButton">
          <FormattedMessage
            id={`form.buttons.${isFiltersOpen ? "hideFilters" : "showFilters"}`}
            data-testid="ToggleFiltersButton"
          />
        </Button>
        <Button variant="outlined" startIcon={<Add />} onClick={handleCreate} data-testid="AirdropCreateButton">
          <FormattedMessage id="form.buttons.create" />
        </Button>
      </PageHeader>

      <AirdropSearchForm onSubmit={handleSearch} initialValues={search} open={isFiltersOpen} />

      <ProgressOverlay isLoading={isLoading}>
        <List>
          {rows.map((airdrop, i) => (
            <ListItem key={i}>
              <ListItemText>{airdrop.account}</ListItemText>
              <ListItemText>{airdrop.item.components[0].token!.template!.title}</ListItemText>
              <ListItemSecondaryAction>
                <IconButton onClick={handleEdit(airdrop)} disabled={airdrop.airdropStatus !== AirdropStatus.NEW}>
                  <Create />
                </IconButton>
                <IconButton onClick={handleDelete(airdrop)} disabled={airdrop.airdropStatus !== AirdropStatus.NEW}>
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
        initialValues={{ ...selected, title: formatMessage({ id: "pages.airdrops.defaultItemTitle" }) }}
      />

      <AirdropEditDialog
        onCancel={handleEditCancel}
        onConfirm={handleEditConfirm}
        open={isEditDialogOpen}
        initialValues={selected}
      />
    </Grid>
  );
};
