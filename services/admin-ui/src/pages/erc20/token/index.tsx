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
import { Create, Delete, FilterList } from "@mui/icons-material";

import { Breadcrumbs, PageHeader, ProgressOverlay } from "@gemunion/mui-page-layout";
import { DeleteDialog } from "@gemunion/mui-dialog-delete";
import { useCollection } from "@gemunion/react-hooks";
import { emptyStateString } from "@gemunion/draft-js-utils";
import { Erc20TokenStatus, Erc20TokenTemplate, IErc20Token, IErc20TokenSearchDto } from "@framework/types";

import { Erc20TokenEditDialog } from "./edit";
import { Erc20TokenSearchForm } from "./form";
import { Erc20TokenDeployButton } from "../../../components/buttons";
import { ContractActions, ContractActionsMenu } from "../../../components/menu";
import { Erc20TokenCreateButton } from "../../../components/buttons/erc20/token-create";

export const Erc20Token: FC = () => {
  const {
    rows,
    count,
    search,
    selected,
    isLoading,
    isFiltersOpen,
    isEditDialogOpen,
    isDeleteDialogOpen,
    fetch,
    handleToggleFilters,
    handleEdit,
    handleEditCancel,
    handleEditConfirm,
    handleDelete,
    handleDeleteCancel,
    handleDeleteConfirm,
    handleSearch,
    handleChangePage,
  } = useCollection<IErc20Token, IErc20TokenSearchDto>({
    baseUrl: "/erc20-tokens",
    empty: {
      title: "",
      description: emptyStateString,
      symbol: "",
    },
    search: {
      query: "",
      tokenStatus: [Erc20TokenStatus.ACTIVE],
      contractTemplate: [],
    },
    filter: ({ title, description, tokenStatus }) => ({ title, description, tokenStatus }),
  });

  return (
    <Grid>
      <Breadcrumbs path={["dashboard", "erc20-tokens"]} />

      <PageHeader message="pages.erc20-tokens.title">
        <Button startIcon={<FilterList />} onClick={handleToggleFilters}>
          <FormattedMessage
            id={`form.buttons.${isFiltersOpen ? "hideFilters" : "showFilters"}`}
            data-testid="ToggleFiltersButton"
          />
        </Button>
        <Erc20TokenCreateButton onUpdate={fetch} />
        <Erc20TokenDeployButton />
      </PageHeader>

      <Erc20TokenSearchForm onSubmit={handleSearch} initialValues={search} open={isFiltersOpen} />

      <ProgressOverlay isLoading={isLoading}>
        <List>
          {rows.map((token, i) => (
            <ListItem key={i}>
              <ListItemText>{token.title}</ListItemText>
              <ListItemSecondaryAction>
                <IconButton onClick={handleEdit(token)}>
                  <Create />
                </IconButton>
                <IconButton onClick={handleDelete(token)} disabled={token.tokenStatus === Erc20TokenStatus.INACTIVE}>
                  <Delete />
                </IconButton>
                <ContractActionsMenu
                  contract={token}
                  actions={[
                    ContractActions.SNAPSHOT,
                    token.contractTemplate === Erc20TokenTemplate.BLACKLIST ? ContractActions.BLACKLIST_ADD : null,
                    token.contractTemplate === Erc20TokenTemplate.BLACKLIST ? ContractActions.BLACKLIST_REMOVE : null,
                  ]}
                  disabled={
                    token.contractTemplate === Erc20TokenTemplate.EXTERNAL ||
                    token.contractTemplate === Erc20TokenTemplate.NATIVE
                  }
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

      <Erc20TokenEditDialog
        onCancel={handleEditCancel}
        onConfirm={handleEditConfirm}
        open={isEditDialogOpen}
        initialValues={selected}
      />
    </Grid>
  );
};
