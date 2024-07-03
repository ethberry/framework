import { FC } from "react";
import { Button, Grid, ListItemText } from "@mui/material";
import { Add, Create, Delete } from "@mui/icons-material";
import { FormattedMessage } from "react-intl";
import { addMonths } from "date-fns";

import { CommonSearchForm } from "@gemunion/mui-form-search";
import type { ISearchDto } from "@gemunion/types-collection";
import { Breadcrumbs, PageHeader, ProgressOverlay } from "@gemunion/mui-page-layout";
import { DeleteDialog } from "@gemunion/mui-dialog-delete";
import { useCollection, CollectionActions } from "@gemunion/react-hooks";
import { emptyItem, emptyPrice } from "@gemunion/mui-inputs-asset";
import { cleanUpAsset } from "@framework/exchange";
import { ListAction, ListActions, StyledListItem, StyledListWrapper, StyledPagination } from "@framework/styled";
import type { IAssetPromo } from "@framework/types";

import { AssetPromoEditDialog } from "./edit";

export const AssetPromo: FC = () => {
  const now = new Date();

  const {
    rows,
    count,
    search,
    selected,
    isLoading,
    isFiltersOpen,
    action,
    handleCreate,
    handleEdit,
    handleEditCancel,
    handleEditConfirm,
    handleDelete,
    handleDeleteCancel,
    handleSearch,
    handleChangePage,
    handleDeleteConfirm,
  } = useCollection<IAssetPromo, ISearchDto>({
    baseUrl: "/promos",
    empty: {
      item: emptyItem,
      price: emptyPrice,
      startTimestamp: addMonths(now, 0).toISOString(),
      endTimestamp: addMonths(now, 1).toISOString(),
    },
    filter: ({ item, price, startTimestamp, endTimestamp }) => ({
      item: cleanUpAsset(item),
      price: cleanUpAsset(price),
      startTimestamp,
      endTimestamp,
    }),
  });

  return (
    <Grid>
      <Breadcrumbs path={["dashboard", "promo"]} />

      <PageHeader message="pages.promo.title">
        <Button variant="outlined" startIcon={<Add />} onClick={handleCreate} data-testid="AssetPromoCreateButton">
          <FormattedMessage id="form.buttons.create" />
        </Button>
      </PageHeader>

      <CommonSearchForm
        onSubmit={handleSearch}
        initialValues={search}
        open={isFiltersOpen}
        testId="AssetPromoSearchForm"
      />

      <ProgressOverlay isLoading={isLoading}>
        <StyledListWrapper count={rows.length} isLoading={isLoading}>
          {rows.map(promo => (
            <StyledListItem key={promo.id}>
              <ListItemText>{promo.item?.components[0].template?.title}</ListItemText>
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
        initialValues={{ ...selected, title: selected.item?.components[0]?.template?.title }}
      />

      <AssetPromoEditDialog
        onCancel={handleEditCancel}
        onConfirm={handleEditConfirm}
        open={action === CollectionActions.edit}
        initialValues={selected}
      />
    </Grid>
  );
};
