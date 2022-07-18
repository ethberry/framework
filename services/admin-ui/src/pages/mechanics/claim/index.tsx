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
import { ClaimStatus, IClaim, IClaimSearchDto } from "@framework/types";
import { useCollection } from "@gemunion/react-hooks";

import { ClaimEditDialog } from "./edit";
import { ClaimSearchForm } from "./form";
import { emptyItem } from "../../../components/inputs/empty-price";
import { cleanUpAsset } from "../../../utils/money";

export const Claim: FC = () => {
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
  } = useCollection<IClaim, IClaimSearchDto>({
    baseUrl: "/claims",
    empty: {
      account: "",
      item: emptyItem,
    },
    search: {
      account: "",
      claimStatus: [],
      templateIds: [],
    },
    filter: ({ id, item, account }) =>
      id ? { item: cleanUpAsset(item), account } : { item: cleanUpAsset(item), account },
  });

  const { formatMessage } = useIntl();

  return (
    <Grid>
      <Breadcrumbs path={["dashboard", "claims"]} />

      <PageHeader message="pages.claims.title">
        <Button startIcon={<FilterList />} onClick={handleToggleFilters} data-testid="ToggleFilterButton">
          <FormattedMessage
            id={`form.buttons.${isFiltersOpen ? "hideFilters" : "showFilters"}`}
            data-testid="ToggleFiltersButton"
          />
        </Button>
        <Button variant="outlined" startIcon={<Add />} onClick={handleCreate} data-testid="ClaimCreateButton">
          <FormattedMessage id="form.buttons.create" />
        </Button>
      </PageHeader>

      <ClaimSearchForm onSubmit={handleSearch} initialValues={search} open={isFiltersOpen} />

      <ProgressOverlay isLoading={isLoading}>
        <List>
          {rows.map((claim, i) => (
            <ListItem key={i}>
              <ListItemText>{claim.account}</ListItemText>
              <ListItemText>{claim.item.components[0]?.template?.title}</ListItemText>
              <ListItemSecondaryAction>
                <IconButton onClick={handleEdit(claim)} disabled={claim.claimStatus !== ClaimStatus.NEW}>
                  <Create />
                </IconButton>
                <IconButton onClick={handleDelete(claim)} disabled={claim.claimStatus !== ClaimStatus.NEW}>
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
        initialValues={{ ...selected, title: formatMessage({ id: "pages.claims.defaultItemTitle" }) }}
      />

      <ClaimEditDialog
        onCancel={handleEditCancel}
        onConfirm={handleEditConfirm}
        open={isEditDialogOpen}
        initialValues={selected}
      />
    </Grid>
  );
};
