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

import { Breadcrumbs, PageHeader, ProgressOverlay } from "@gemunion/mui-page-layout";
import { DeleteDialog } from "@gemunion/mui-dialog-delete";
import { useCollection } from "@gemunion/react-hooks";
import { emptyStateString } from "@gemunion/draft-js-utils";
import { IStaking, IStakingItem, IStakingSearchDto, StakingStatus, TokenType } from "@framework/types";

import { StakingEditDialog } from "./edit";
import { StakingSearchForm } from "./form";
import { StakingUploadButton } from "../../components/buttons";

export const Staking: FC = () => {
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
  } = useCollection<IStaking, IStakingSearchDto>({
    baseUrl: "/staking",
    empty: {
      title: "",
      description: emptyStateString,
      deposit: {
        tokenType: TokenType.NATIVE,
        collection: 0,
      } as IStakingItem,
      reward: {
        tokenType: TokenType.NATIVE,
        collection: 0,
      } as IStakingItem,
      duration: 30,
      penalty: 100,
      recurrent: false,
    },
    search: {
      query: "",
      stakingStatus: [StakingStatus.ACTIVE, StakingStatus.NEW],
      deposit: {
        tokenType: [] as Array<TokenType>,
      },
      reward: {
        tokenType: [] as Array<TokenType>,
      },
    },
    filter: ({ id, title, description, ...rest }) => (id ? { title, description } : { title, description, ...rest }),
  });

  return (
    <Grid>
      <Breadcrumbs path={["dashboard", "staking"]} />

      <PageHeader message="pages.staking.title">
        <Button startIcon={<FilterList />} onClick={handleToggleFilters} data-testid="ToggleFilterButton">
          <FormattedMessage
            id={`form.buttons.${isFiltersOpen ? "hideFilters" : "showFilters"}`}
            data-testid="ToggleFiltersButton"
          />
        </Button>
        <Button variant="outlined" startIcon={<Add />} onClick={handleCreate} data-testid="StakingCreateButton">
          <FormattedMessage id="form.buttons.create" />
        </Button>
      </PageHeader>

      <StakingSearchForm onSubmit={handleSearch} initialValues={search} open={isFiltersOpen} />

      <ProgressOverlay isLoading={isLoading}>
        <List>
          {rows.map((rule, i) => (
            <ListItem key={i} disableGutters>
              <ListItemText>{rule.title}</ListItemText>
              <ListItemSecondaryAction>
                <StakingUploadButton rule={rule} />
                <IconButton onClick={handleEdit(rule)}>
                  <Create />
                </IconButton>
                <IconButton onClick={handleDelete(rule)} disabled={rule.stakingStatus !== StakingStatus.NEW}>
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
        initialValues={{ ...selected, title: "FIX ME STAKING" }}
      />

      <StakingEditDialog
        onCancel={handleEditCancel}
        onConfirm={handleEditConfirm}
        open={isEditDialogOpen}
        initialValues={selected}
      />
    </Grid>
  );
};
