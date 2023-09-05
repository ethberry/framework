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

import { SelectInput } from "@gemunion/mui-inputs-core";
import { EntityInput } from "@gemunion/mui-inputs-entity";
import { CommonSearchForm } from "@gemunion/mui-form-search";
import { Breadcrumbs, PageHeader, ProgressOverlay } from "@gemunion/mui-page-layout";
import { DeleteDialog } from "@gemunion/mui-dialog-delete";
import { useCollection } from "@gemunion/react-hooks";
import { emptyStateString } from "@gemunion/draft-js-utils";
import { useUser } from "@gemunion/provider-user";
import { emptyItem, emptyPrice } from "@gemunion/mui-inputs-asset";
import type { IMysteryBox, IMysteryBoxSearchDto, ITemplate } from "@framework/types";
import { IUser, ModuleType, MysteryBoxStatus, TokenType } from "@framework/types";

import { MysteryActionsMenu } from "../../../../components/menu/mechanics/mystery/box";
import { cleanUpAsset } from "../../../../utils/money";
import { MysteryboxEditDialog } from "./edit";
import { ContractInput } from "../../../../components/forms/template-search/contract-input";

export const MysteryBox: FC = () => {
  const { profile } = useUser<IUser>();

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
  } = useCollection<IMysteryBox, IMysteryBoxSearchDto>({
    baseUrl: "/mystery/boxes",
    empty: {
      title: "",
      description: emptyStateString,
      item: emptyItem,
      template: {
        price: emptyPrice,
      } as ITemplate,
      // @ts-ignore
      // this is only filter for contract autocomplete
      merchantId: profile.merchantId,
    },
    search: {
      query: "",
      mysteryBoxStatus: [MysteryBoxStatus.ACTIVE],
      contractIds: [],
      merchantId: profile.merchantId,
    },
    filter: ({ id, template, title, description, imageUrl, item, mysteryBoxStatus }) =>
      id
        ? {
            title,
            description,
            imageUrl,
            item: cleanUpAsset(item),
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

  return (
    <Grid>
      <Breadcrumbs path={["dashboard", "mystery", "mystery.boxes"]} />

      <PageHeader message="pages.mystery.boxes.title">
        <Button startIcon={<FilterList />} onClick={handleToggleFilters} data-testid="ToggleFilterButton">
          <FormattedMessage
            id={`form.buttons.${isFiltersOpen ? "hideFilters" : "showFilters"}`}
            data-testid="ToggleFiltersButton"
          />
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
        <Grid container spacing={2} alignItems="flex-end">
          <Grid item xs={12}>
            <EntityInput name="merchantId" controller="merchants" />
          </Grid>
          <Grid item xs={6}>
            <ContractInput
              name="contractIds"
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

      <ProgressOverlay isLoading={isLoading}>
        <List>
          {rows.map((mystery, i) => (
            <ListItem key={i}>
              <ListItemText>{mystery.title}</ListItemText>
              <ListItemSecondaryAction>
                <IconButton onClick={handleEdit(mystery)}>
                  <Create />
                </IconButton>
                <IconButton
                  onClick={handleDelete(mystery)}
                  disabled={mystery.mysteryBoxStatus === MysteryBoxStatus.INACTIVE}
                >
                  <Delete />
                </IconButton>
                <MysteryActionsMenu
                  mystery={mystery}
                  disabled={mystery.mysteryBoxStatus === MysteryBoxStatus.INACTIVE}
                />
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

      <MysteryboxEditDialog
        onCancel={handleEditCancel}
        onConfirm={handleEditConfirm}
        open={isEditDialogOpen}
        initialValues={selected}
      />
    </Grid>
  );
};
