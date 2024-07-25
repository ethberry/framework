import { FC } from "react";
import { FormattedMessage } from "react-intl";
import { Button, Grid, ListItemText } from "@mui/material";
import { Add, Create, Delete } from "@mui/icons-material";

import { ListAction, ListActions, StyledListItem, StyledListWrapper, StyledPagination } from "@framework/styled";
import type { IProductPromo } from "@framework/types";
import { DeleteDialog } from "@gemunion/mui-dialog-delete";
import { CommonSearchForm } from "@gemunion/mui-form-search";
import { Breadcrumbs, PageHeader, ProgressOverlay } from "@gemunion/mui-page-layout";
import { useCollection, CollectionActions } from "@gemunion/provider-collection";
import type { ISearchDto } from "@gemunion/types-collection";

import { emptyPromo } from "../../../components/common/interfaces";
import { EditPromoDialog } from "./edit";

export const ProductPromo: FC = () => {
  const {
    rows,
    count,
    search,
    action,
    selected,
    isLoading,
    handleCreate,
    handleDelete,
    handleDeleteCancel,
    handleDeleteConfirm,
    handleEdit,
    handleEditCancel,
    handleEditConfirm,
    handleSearch,
    handleChangePage,
  } = useCollection<IProductPromo, ISearchDto>({
    baseUrl: "/promos",
    empty: emptyPromo,
  });

  return (
    <Grid>
      <Breadcrumbs path={["dashboard", "promos"]} />

      <PageHeader message="pages.promos.title">
        <Button variant="outlined" startIcon={<Add />} onClick={handleCreate} data-testid="ProductPromoCreateButton">
          <FormattedMessage id="form.buttons.create" />
        </Button>
      </PageHeader>

      <CommonSearchForm onSubmit={handleSearch} initialValues={search} />

      <ProgressOverlay isLoading={isLoading}>
        <StyledListWrapper count={rows.length} isLoading={isLoading}>
          {rows.map(promo => (
            <StyledListItem key={promo.id}>
              <ListItemText>{promo.product!.title}</ListItemText>
              <ListActions>
                <ListAction
                  onClick={handleEdit(promo)}
                  message="form.buttons.edit"
                  dataTestId="PromoEditButton"
                  icon={Create}
                />
                <ListAction
                  onClick={handleDelete(promo)}
                  message="form.buttons.delete"
                  dataTestId="PromoDeleteButton"
                  icon={Delete}
                />
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

      <EditPromoDialog
        onCancel={handleEditCancel}
        onConfirm={handleEditConfirm}
        open={action === CollectionActions.edit}
        initialValues={selected}
      />
    </Grid>
  );
};
