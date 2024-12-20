import { FC } from "react";
import { FormattedMessage } from "react-intl";
import { Button, Grid, ListItemText } from "@mui/material";
import { Add, Create, Delete, FilterList } from "@mui/icons-material";
import { useWeb3React } from "@web3-react/core";

import { SelectInput } from "@gemunion/mui-inputs-core";
import { CommonSearchForm } from "@gemunion/mui-form-search";
import { Breadcrumbs, PageHeader } from "@gemunion/mui-page-layout";
import { DeleteDialog } from "@gemunion/mui-dialog-delete";
import { useCollection, CollectionActions } from "@gemunion/provider-collection";
import { emptyStateString } from "@gemunion/draft-js-utils";
import { useUser } from "@gemunion/provider-user";
import { emptyItem, emptyPrice } from "@gemunion/mui-inputs-asset";
import { cleanUpAsset } from "@framework/exchange";
import { ListAction, ListActions, ListItem, StyledPagination } from "@framework/styled";
import type { IMysteryBox, IMysteryBoxSearchDto, ITemplate, IUser } from "@framework/types";
import { ModuleType, MysteryBoxStatus, TokenType } from "@framework/types";

import { MysteryBoxMintButton } from "../../../../../components/buttons";
import { ContractInput } from "../../../../../components/forms/template-search/contract-input";
import { SearchMerchantInput } from "../../../../../components/inputs/search-merchant";
import { WithCheckPermissionsListWrapper } from "../../../../../components/wrappers";
import { MysteryBoxEditDialog } from "./edit";

export const MysteryBox: FC = () => {
  const { profile } = useUser<IUser>();

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
  } = useCollection<IMysteryBox, IMysteryBoxSearchDto>({
    baseUrl: "/mystery/boxes",
    empty: {
      title: "",
      description: emptyStateString,
      content: emptyItem,
      template: {
        price: emptyPrice,
      } as ITemplate,
    },
    search: {
      query: "",
      mysteryBoxStatus: [MysteryBoxStatus.ACTIVE],
      contractIds: [],
      merchantId: profile.merchantId,
    },
    filter: ({ id, template, title, description, imageUrl, content, mysteryBoxStatus }) =>
      id
        ? {
            title,
            description,
            imageUrl,
            content: cleanUpAsset(content),
            price: cleanUpAsset(template?.price),
            mysteryBoxStatus,
          }
        : {
            contractId: template?.contractId,
            title,
            description,
            imageUrl,
            content: cleanUpAsset(content),
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
        <Grid container spacing={2} alignItems="flex-end">
          <Grid item xs={12}>
            <SearchMerchantInput />
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

      <MysteryBoxEditDialog
        onCancel={handleEditCancel}
        onConfirm={handleEditConfirm}
        open={action === CollectionActions.edit}
        initialValues={selected}
      />
    </Grid>
  );
};
