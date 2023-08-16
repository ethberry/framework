import { FC } from "react";
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

import { FormattedMessage, useIntl } from "react-intl";

import { Breadcrumbs, PageHeader, ProgressOverlay } from "@gemunion/mui-page-layout";
import { DeleteDialog } from "@gemunion/mui-dialog-delete";
import { useCollection } from "@gemunion/react-hooks";
import { useUser } from "@gemunion/provider-user";
import { getEmptyTemplate } from "@gemunion/mui-inputs-asset";
import { AddressLink } from "@gemunion/mui-scanner";
import type { IClaimSearchDto } from "@framework/types";
import { ClaimStatus, IUser, TokenType } from "@framework/types";

import { cleanUpAsset } from "../../../../utils/money";
import { VestingClaimUploadButton } from "../../../../components/buttons";
import { ClaimSearchForm } from "../../claim/main/form";
import { VestingClaimEditDialog } from "./edit";
// import { VestingActionsMenu } from "../../../../components/menu/mechanics/vesting";

export const VestingClaim: FC = () => {
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
    handleDeleteConfirm,
    handleSearch,
    handleChangePage,
  } = useCollection<any, IClaimSearchDto>({
    baseUrl: "/vesting/claims",
    empty: {
      parameters: {
        beneficiary: "",
        startTimestamp: new Date().toISOString(),
        cliffInMonth: 12,
        monthlyRelease: 1000,
      },
      item: getEmptyTemplate(TokenType.ERC20),
    },
    search: {
      account: "",
      claimStatus: [ClaimStatus.NEW],
      merchantId: profile.merchantId,
    },
    filter: ({ item, parameters }) => ({
      parameters: {
        beneficiary: parameters.beneficiary,
        monthlyRelease: parameters.monthlyRelease,
        cliffInMonth: parameters.cliffInMonth,
        startTimestamp: parameters.startTimestamp,
      },
      item: cleanUpAsset(item),
    }),
  });

  const { formatMessage } = useIntl();

  return (
    <Grid>
      <Breadcrumbs path={["dashboard", "vesting", "vesting.claims"]} />

      <PageHeader message="pages.vesting.claims.title">
        <Button startIcon={<FilterList />} onClick={handleToggleFilters} data-testid="ToggleFilterButton">
          <FormattedMessage id={`form.buttons.${isFiltersOpen ? "hideFilters" : "showFilters"}`} />
        </Button>
        <VestingClaimUploadButton />
        <Button variant="outlined" startIcon={<Add />} onClick={handleCreate} data-testid="ClaimCreateButton">
          <FormattedMessage id="form.buttons.create" />
        </Button>
      </PageHeader>

      <ClaimSearchForm onSubmit={handleSearch} initialValues={search} open={isFiltersOpen} />

      <ProgressOverlay isLoading={isLoading}>
        <List sx={{ overflowX: "scroll" }}>
          {rows.map((vesting, i) => (
            <ListItem key={i} sx={{ flexWrap: "wrap" }}>
              <ListItemText sx={{ width: 0.5 }}>
                <AddressLink address={vesting.account as string} length={42} />
              </ListItemText>
              <ListItemSecondaryAction
                sx={{
                  top: { xs: "80%", sm: "50%" },
                  transform: { xs: "translateY(-80%)", sm: "translateY(-50%)" },
                }}
              >
                <IconButton onClick={handleEdit(vesting)} disabled={vesting.claimStatus !== ClaimStatus.NEW}>
                  <Create />
                </IconButton>
                <IconButton onClick={handleDelete(vesting)} disabled={vesting.claimStatus !== ClaimStatus.NEW}>
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

      <VestingClaimEditDialog
        onCancel={handleEditCancel}
        onConfirm={handleEditConfirm}
        open={isEditDialogOpen}
        initialValues={selected}
      />
    </Grid>
  );
};
