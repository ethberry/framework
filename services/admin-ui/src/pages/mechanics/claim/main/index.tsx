import { FC, Fragment } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import { Button, IconButton, List, ListItem, ListItemSecondaryAction, ListItemText, Pagination } from "@mui/material";
import { Add, Create, Delete, FilterList } from "@mui/icons-material";

import { Breadcrumbs, PageHeader, ProgressOverlay } from "@gemunion/mui-page-layout";
import { DeleteDialog } from "@gemunion/mui-dialog-delete";
import { useCollection } from "@gemunion/react-hooks";
import { emptyItem } from "@gemunion/mui-inputs-asset";
import { ClaimStatus, IClaim, IClaimSearchDto } from "@framework/types";

import { ClaimUploadButton } from "../../../../components/buttons/mechanics/claim/upload";
import { cleanUpAsset } from "../../../../utils/money";
import { ClaimEditDialog } from "./edit";
import { ClaimSearchForm } from "./form";

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
      endTimestamp: new Date(0).toISOString(),
    },
    search: {
      account: "",
      claimStatus: [],
    },
    filter: ({ item, account, endTimestamp }) => ({ item: cleanUpAsset(item), account, endTimestamp }),
  });

  const { formatMessage } = useIntl();
  return (
    <Fragment>
      <Breadcrumbs path={["dashboard", "claims"]} />

      <PageHeader message="pages.claims.title">
        <Button startIcon={<FilterList />} onClick={handleToggleFilters} data-testid="ToggleFilterButton">
          <FormattedMessage
            id={`form.buttons.${isFiltersOpen ? "hideFilters" : "showFilters"}`}
            data-testid="ToggleFiltersButton"
          />
        </Button>
        <ClaimUploadButton />
        <Button variant="outlined" startIcon={<Add />} onClick={handleCreate} data-testid="ClaimCreateButton">
          <FormattedMessage id="form.buttons.create" />
        </Button>
      </PageHeader>

      <ClaimSearchForm onSubmit={handleSearch} initialValues={search} open={isFiltersOpen} />

      <ProgressOverlay isLoading={isLoading}>
        <List sx={{ overflowX: "scroll" }}>
          {rows.map((claim, i) => (
            <ListItem key={i} sx={{ flexWrap: "wrap" }}>
              <ListItemText sx={{ width: 0.6 }}>{claim.account}</ListItemText>
              <ListItemText sx={{ width: { xs: 0.6, md: 0.2 } }}>
                {claim.item.components.map(component => component.template?.title).join(", ")}
              </ListItemText>
              <ListItemSecondaryAction
                sx={{
                  top: { xs: "80%", sm: "50%" },
                  transform: { xs: "translateY(-80%)", sm: "translateY(-50%)" },
                }}
              >
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
        initialValues={{
          ...selected,
          title: formatMessage({ id: "pages.claims.defaultItemTitle" }, { account: selected.account }),
        }}
      />

      <ClaimEditDialog
        onCancel={handleEditCancel}
        onConfirm={handleEditConfirm}
        open={isEditDialogOpen}
        initialValues={selected}
      />
    </Fragment>
  );
};
