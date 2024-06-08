import { FC } from "react";
import { FormattedMessage } from "react-intl";
import { Button, Grid, ListItemText } from "@mui/material";
import { Add, Create, Delete, FilterList } from "@mui/icons-material";

import { SelectInput } from "@gemunion/mui-inputs-core";
import { EntityInput } from "@gemunion/mui-inputs-entity";
import { CommonSearchForm } from "@gemunion/mui-form-search";
import { Breadcrumbs, PageHeader, ProgressOverlay } from "@gemunion/mui-page-layout";
import { DeleteDialog } from "@gemunion/mui-dialog-delete";
import { useCollection, CollectionActions } from "@gemunion/react-hooks";
import { emptyStateString } from "@gemunion/draft-js-utils";
import { emptyItem, emptyPrice } from "@gemunion/mui-inputs-asset";
import { cleanUpAsset } from "@framework/exchange";
import { ListAction, ListActions, StyledListItem, StyledListWrapper, StyledPagination } from "@framework/styled";
import type { ILootBox, ILootBoxSearchDto, ITemplate } from "@framework/types";
import { ModuleType, LootBoxStatus, TokenType } from "@framework/types";

import { MintButton } from "../../../../../components/buttons/mechanics/loot/box/mint";
import { FormRefresher } from "../../../../../components/forms/form-refresher";
import { LootboxEditDialog } from "./edit";

export const LootBox: FC = () => {
  const {
    rows,
    count,
    search,
    action,
    selected,
    isLoading,
    isFiltersOpen,
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
    handleRefreshPage,
  } = useCollection<ILootBox, ILootBoxSearchDto>({
    baseUrl: "/loot/boxes",
    empty: {
      title: "",
      description: emptyStateString,
      item: emptyItem,
      template: {
        price: emptyPrice,
      } as ITemplate,
    },
    search: {
      query: "",
      lootBoxStatus: [LootBoxStatus.ACTIVE],
      contractIds: [],
    },
    filter: ({ id, template, title, description, imageUrl, item, lootBoxStatus, min, max }) =>
      id
        ? {
            title,
            description,
            imageUrl,
            item: cleanUpAsset(item),
            price: cleanUpAsset(template?.price),
            lootBoxStatus,
            min,
            max,
          }
        : {
            contractId: template?.contractId,
            title,
            description,
            imageUrl,
            item: cleanUpAsset(item),
            price: cleanUpAsset(template?.price),
            min,
            max,
          },
  });

  return (
    <Grid>
      <Breadcrumbs path={["dashboard", "loot", "loot.boxes"]} />

      <PageHeader message="pages.loot.boxes.title">
        <Button startIcon={<FilterList />} onClick={handleToggleFilters} data-testid="ToggleFilterButton">
          <FormattedMessage id={`form.buttons.${isFiltersOpen ? "hideFilters" : "showFilters"}`} />
        </Button>
        <Button variant="outlined" startIcon={<Add />} onClick={handleCreate} data-testid="LootBoxCreateButton">
          <FormattedMessage id="form.buttons.create" />
        </Button>
      </PageHeader>

      <CommonSearchForm onSubmit={handleSearch} initialValues={search} open={isFiltersOpen} testId="LootboxSearchForm">
        <FormRefresher onRefreshPage={handleRefreshPage} />
        <Grid container spacing={2} alignItems="flex-end">
          <Grid item xs={6}>
            <EntityInput
              name="contractIds"
              controller="contracts"
              multiple
              data={{
                contractType: [TokenType.ERC721],
                contractModule: [ModuleType.LOOT],
              }}
            />
          </Grid>
          <Grid item xs={6}>
            <SelectInput multiple name="lootBoxStatus" options={LootBoxStatus} />
          </Grid>
        </Grid>
      </CommonSearchForm>

      <ProgressOverlay isLoading={isLoading}>
        <StyledListWrapper count={rows.length} isLoading={isLoading}>
          {rows.map(loot => (
            <StyledListItem key={loot.id}>
              <ListItemText>{loot.title}</ListItemText>
              <ListActions>
                <ListAction onClick={handleEdit(loot)} message="form.buttons.edit" icon={Create} />
                <ListAction
                  onClick={handleDelete(loot)}
                  icon={Delete}
                  message="form.buttons.delete"
                  disabled={loot.lootBoxStatus === LootBoxStatus.INACTIVE}
                />
                <MintButton loot={loot} disabled={loot.lootBoxStatus === LootBoxStatus.INACTIVE} />
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

      <LootboxEditDialog
        onCancel={handleEditCancel}
        onConfirm={handleEditConfirm}
        open={action === CollectionActions.edit}
        initialValues={selected}
      />
    </Grid>
  );
};
