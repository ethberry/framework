import { FC } from "react";
import { FormattedMessage } from "react-intl";
import { Button, Grid, ListItemText } from "@mui/material";
import { Add, Create, Delete, FilterList } from "@mui/icons-material";
import { useWeb3React } from "@web3-react/core";

import { SelectInput } from "@gemunion/mui-inputs-core";
import { EntityInput } from "@gemunion/mui-inputs-entity";
import { CommonSearchForm } from "@gemunion/mui-form-search";
import { Breadcrumbs, PageHeader } from "@gemunion/mui-page-layout";
import { DeleteDialog } from "@gemunion/mui-dialog-delete";
import { useCollection, CollectionActions } from "@gemunion/provider-collection";
import { emptyStateString } from "@gemunion/draft-js-utils";
import { emptyItem, emptyPrice } from "@gemunion/mui-inputs-asset";
import { cleanUpAsset } from "@framework/exchange";
import { ListAction, ListActions, ListItem, StyledPagination } from "@framework/styled";
import type { IMysteryBox, IMysteryBoxSearchDto, ITemplate } from "@framework/types";
import { ModuleType, MysteryBoxStatus, TokenType } from "@framework/types";

import { MysteryBoxMintButton } from "../../../../../components/buttons";
import { FormRefresher } from "../../../../../components/forms/form-refresher";
import { WithCheckPermissionsListWrapper } from "../../../../../components/wrappers";
import { MysteryboxEditDialog } from "./edit";

export const MysteryBox: FC = () => {
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
  } = useCollection<IMysteryBox, IMysteryBoxSearchDto>({
    baseUrl: "/mystery/boxes",
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
      mysteryBoxStatus: [MysteryBoxStatus.ACTIVE],
      contractIds: [],
    },
    filter: ({ id, template, title, description, imageUrl, item, mysteryBoxStatus }) =>
      id
        ? {
            title,
            description,
            imageUrl,
            price: cleanUpAsset(template?.price),
            mysteryBoxStatus,
          }
        : {
            contractId: template?.contractId,
            title,
            description,
            imageUrl,
            item: cleanUpAsset(item),
            price: cleanUpAsset(template?.price),
          },
  });

  const { account = "" } = useWeb3React();

  return (
    <Grid>
      <Breadcrumbs path={["dashboard", "mystery", "mystery.boxes"]} />

      <PageHeader message="pages.mystery.boxes.title">
        <Button startIcon={<FilterList />} onClick={handleToggleFilters} data-testid="ToggleFilterButton">
          <FormattedMessage id={`form.buttons.${isFiltersOpen ? "hideFilters" : "showFilters"}`} />
        </Button>
        <Button variant="outlined" startIcon={<Add />} onClick={handleCreate} data-testid="MysteryBoxCreateButton">
          <FormattedMessage id="form.buttons.create" />
        </Button>
      </PageHeader>

      <CommonSearchForm
        onSubmit={handleSearch}
        initialValues={search}
        open={isFiltersOpen}
        testId="MysteryboxSearchForm"
      >
        <FormRefresher onRefreshPage={handleRefreshPage} />
        <Grid container spacing={2} alignItems="flex-end">
          <Grid item xs={6}>
            <EntityInput
              name="contractIds"
              controller="contracts"
              multiple
              data={{
                contractType: [TokenType.ERC721],
                contractModule: [ModuleType.MYSTERY],
              }}
            />
          </Grid>
          <Grid item xs={6}>
            <SelectInput multiple name="mysteryBoxStatus" options={MysteryBoxStatus} />
          </Grid>
        </Grid>
      </CommonSearchForm>

      <WithCheckPermissionsListWrapper isLoading={isLoading} count={rows.length}>
        {rows.map(mystery => (
          <ListItem key={mystery.id} account={account} contract={mystery.template?.contract}>
            <ListItemText>{mystery.title}</ListItemText>
            <ListActions>
              <ListAction
                onClick={handleEdit(mystery)}
                message="form.buttons.edit"
                dataTestId="MysteryEditButton"
                icon={Create}
              />
              <ListAction
                onClick={handleDelete(mystery)}
                message="form.buttons.delete"
                dataTestId="MysteryDeleteButton"
                icon={Delete}
                disabled={mystery.mysteryBoxStatus === MysteryBoxStatus.INACTIVE}
              />
              <MysteryBoxMintButton
                mystery={mystery}
                disabled={mystery.mysteryBoxStatus === MysteryBoxStatus.INACTIVE}
              />
            </ListActions>
          </ListItem>
        ))}
      </WithCheckPermissionsListWrapper>

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

      <MysteryboxEditDialog
        onCancel={handleEditCancel}
        onConfirm={handleEditConfirm}
        open={action === CollectionActions.edit}
        initialValues={selected}
      />
    </Grid>
  );
};
