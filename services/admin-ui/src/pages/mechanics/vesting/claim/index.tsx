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

import { FormattedMessage } from "react-intl";

import { Breadcrumbs, PageHeader, ProgressOverlay } from "@gemunion/mui-page-layout";
import { useCollection } from "@gemunion/react-hooks";
import { getEmptyTemplate } from "@gemunion/mui-inputs-asset";
import type { IClaimSearchDto } from "@framework/types";
import { ClaimStatus, TokenType } from "@framework/types";
import { VestingClaimEditDialog } from "./edit";
import { ClaimSearchForm } from "../../claim/main/form";
import { VestingClaimUploadButton } from "../../../../components/buttons/mechanics/vesting/upload";
// import { VestingActionsMenu } from "../../../../components/menu/mechanics/vesting";

export const VestingClaim: FC = () => {
  const {
    rows,
    count,
    search,
    selected,
    isLoading,
    isFiltersOpen,
    isEditDialogOpen,
    handleCreate,
    handleToggleFilters,
    handleEdit,
    handleEditCancel,
    handleEditConfirm,
    handleDelete,
    handleSearch,
    handleChangePage,
  } = useCollection<any, IClaimSearchDto>({
    baseUrl: "/vesting/claims",
    empty: {
      beneficiary: "",
      startTimestamp: new Date().toISOString(),
      cliffInMonth: 12,
      monthlyRelease: 1000,
      item: getEmptyTemplate(TokenType.ERC20),
    },
    search: {
      account: "",
      claimStatus: [],
    },
  });

  return (
    <Grid>
      <Breadcrumbs path={["dashboard", "vesting", "vesting.contracts"]} />

      <PageHeader message="pages.vesting.title">
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
              <ListItemText sx={{ width: 0.6 }}>{vesting.account}</ListItemText>
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

      <VestingClaimEditDialog
        onCancel={handleEditCancel}
        onConfirm={handleEditConfirm}
        open={isEditDialogOpen}
        initialValues={selected}
      />
    </Grid>
  );
};
