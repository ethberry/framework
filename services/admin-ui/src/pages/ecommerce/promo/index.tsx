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
import { Add, Create, Delete } from "@mui/icons-material";

import { IPromo } from "@framework/types";
import { DeleteDialog } from "@gemunion/mui-dialog-delete";
import { CommonSearchForm } from "@gemunion/mui-form-search";
import { Breadcrumbs, PageHeader, ProgressOverlay } from "@gemunion/mui-page-layout";
import { useCollection } from "@gemunion/react-hooks";
import { ISearchDto } from "@gemunion/types-collection";

import { emptyPromo } from "../../../components/common/interfaces";
import { EditPromoDialog } from "./edit";

export const Promo: FC = () => {
  const {
    rows,
    count,
    search,
    selected,
    isLoading,
    isDeleteDialogOpen,
    isEditDialogOpen,
    handleCreate,
    handleDelete,
    handleDeleteCancel,
    handleDeleteConfirm,
    handleEdit,
    handleEditCancel,
    handleEditConfirm,
    handleSearch,
    handleChangePage,
  } = useCollection<IPromo, ISearchDto>({
    baseUrl: "/ecommerce/promos",
    empty: emptyPromo,
  });

  return (
    <Grid>
      <Breadcrumbs path={["dashboard", "ecommerce", "promos"]} />

      <PageHeader message="pages.promos.title">
        <Button variant="outlined" startIcon={<Add />} onClick={handleCreate} data-testid="EcommercePromoCreateButton">
          <FormattedMessage id="form.buttons.create" />
        </Button>
      </PageHeader>

      <CommonSearchForm onSubmit={handleSearch} initialValues={search} />

      <ProgressOverlay isLoading={isLoading}>
        <List disablePadding={true}>
          {rows.map((promo, i) => (
            <ListItem key={i}>
              <ListItemText>{promo.product!.title}</ListItemText>
              <ListItemSecondaryAction>
                <IconButton onClick={handleEdit(promo)}>
                  <Create />
                </IconButton>
                <IconButton onClick={handleDelete(promo)}>
                  <Delete />
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
          ))}
        </List>
      </ProgressOverlay>

      <Pagination
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

      <EditPromoDialog
        onCancel={handleEditCancel}
        onConfirm={handleEditConfirm}
        open={isEditDialogOpen}
        initialValues={selected}
      />
    </Grid>
  );
};
