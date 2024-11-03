import { FC } from "react";
import { useNavigate } from "react-router";
import { FormattedMessage } from "react-intl";
import { Button, Grid, ListItemText } from "@mui/material";
import { Add, Create, Delete, FilterList } from "@mui/icons-material";
import { useWeb3React } from "@web3-react/core";

import { SelectInput } from "@ethberry/mui-inputs-core";
import { EntityInput } from "@ethberry/mui-inputs-entity";
import { CommonSearchForm } from "@ethberry/mui-form-search";
import { PageHeader } from "@ethberry/mui-page-layout";
import { DeleteDialog } from "@ethberry/mui-dialog-delete";
import { useCollection, CollectionActions } from "@ethberry/provider-collection";
import { Breadcrumbs } from "@ethberry/mui-page-layout";
import { cleanUpAsset } from "@framework/exchange";
import { ListAction, ListActions, ListItem, StyledPagination } from "@framework/styled";
import type { IVestingBox, IVestingBoxSearchDto } from "@framework/types";
import { ModuleType, VestingBoxStatus, TokenType } from "@framework/types";

import { VestingBoxMintButton } from "../../../../../components/buttons";
import { WithCheckPermissionsListWrapper } from "../../../../../components/wrappers";
import { emptyValues } from "./edit/vesting-box";
import { VestingBoxEditDialog } from "./edit";

export const VestingBox: FC = () => {
  const {
    rows,
    count,
    search,
    action,
    selected,
    isLoading,
    isFiltersOpen,
    handleToggleFilters,
    handleEdit,
    handleEditCancel,
    handleEditConfirm,
    handleDelete,
    handleDeleteCancel,
    handleSearch,
    handleChangePage,
    handleDeleteConfirm,
  } = useCollection<IVestingBox, IVestingBoxSearchDto>({
    baseUrl: "/vesting/boxes",
    empty: emptyValues,
    search: {
      query: "",
      vestingBoxStatus: [VestingBoxStatus.ACTIVE],
      contractIds: [],
    },
    filter: ({
      template,
      title,
      description,
      imageUrl,
      content,
      vestingBoxStatus,
      period,
      growthRate,
      cliff,
      afterCliffBasisPoints,
      shape,
      startTimestamp,
      duration,
    }) => ({
      title,
      description,
      imageUrl,
      content: cleanUpAsset(content),
      price: cleanUpAsset(template?.price),
      vestingBoxStatus,
      period,
      growthRate,
      cliff,
      afterCliffBasisPoints,
      shape,
      startTimestamp,
      duration,
    }),
  });

  const navigate = useNavigate();
  const { account = "" } = useWeb3React();

  const handleCreate = () => navigate("/vesting/box/create");

  return (
    <Grid>
      <Breadcrumbs path={["dashboard", "vesting", "vesting.boxes"]} />

      <PageHeader message="pages.vesting.boxes.title">
        <Button startIcon={<FilterList />} onClick={handleToggleFilters} data-testid="ToggleFilterButton">
          <FormattedMessage id={`form.buttons.${isFiltersOpen ? "hideFilters" : "showFilters"}`} />
        </Button>
        <Button variant="outlined" startIcon={<Add />} onClick={handleCreate} data-testid="VestingBoxCreateButton">
          <FormattedMessage id="form.buttons.create" />
        </Button>
      </PageHeader>

      <CommonSearchForm
        onSubmit={handleSearch}
        initialValues={search}
        open={isFiltersOpen}
        testId="VestingboxSearchForm"
      >
        <Grid container spacing={2} alignItems="flex-end">
          <Grid item xs={6}>
            <EntityInput
              name="contractIds"
              controller="contracts"
              multiple
              data={{
                contractType: [TokenType.ERC721],
                contractModule: [ModuleType.VESTING],
              }}
            />
          </Grid>
          <Grid item xs={6}>
            <SelectInput multiple name="vestingBoxStatus" options={VestingBoxStatus} />
          </Grid>
        </Grid>
      </CommonSearchForm>

      <WithCheckPermissionsListWrapper isLoading={isLoading} count={rows.length}>
        {rows.map(vesting => (
          <ListItem key={vesting.id} account={account} contract={vesting.template?.contract}>
            <ListItemText>{vesting.title}</ListItemText>
            <ListActions>
              <ListAction
                onClick={handleEdit(vesting)}
                message="form.buttons.edit"
                dataTestId="VestingEditButton"
                icon={Create}
              />
              <ListAction
                onClick={handleDelete(vesting)}
                message="form.buttons.delete"
                dataTestId="VestingDeleteButton"
                icon={Delete}
                disabled={vesting.vestingBoxStatus === VestingBoxStatus.INACTIVE}
              />
              <VestingBoxMintButton
                vesting={vesting}
                disabled={vesting.vestingBoxStatus === VestingBoxStatus.INACTIVE}
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

      <VestingBoxEditDialog
        onCancel={handleEditCancel}
        onConfirm={handleEditConfirm}
        open={action === CollectionActions.edit}
        initialValues={selected}
      />
    </Grid>
  );
};
