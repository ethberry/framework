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
import { constants } from "ethers";

import { Breadcrumbs, PageHeader, ProgressOverlay } from "@gemunion/mui-page-layout";
import { DeleteDialog } from "@gemunion/mui-dialog-delete";
import { useCollection } from "@gemunion/react-hooks";
import { emptyStateString } from "@gemunion/draft-js-utils";
import {
  ContractStatus,
  ContractTemplate,
  Erc20ContractTemplate,
  IContract,
  IContractSearchDto,
  ITemplate,
} from "@framework/types";

import { Erc20TokenEditDialog } from "./edit";
import { Erc20ContractCreateButton, Erc20TokenDeployButton } from "../../../components/buttons";
import { ContractActions, ContractActionsMenu } from "../../../components/menu";
import { ContractSearchForm } from "../../../components/forms/contract-search";

export const Erc20Contract: FC = () => {
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
  } = useCollection<IContract, IContractSearchDto>({
    baseUrl: "/erc20-contracts",
    empty: {
      title: "",
      description: emptyStateString,
      symbol: "",
      templates: [
        {
          decimals: 18,
          cap: constants.WeiPerEther.toString(),
        } as ITemplate,
      ],
    },
    search: {
      query: "",
      contractStatus: [ContractStatus.ACTIVE],
      contractTemplate: [],
      contractRole: [],
    },
    filter: ({ title, description, contractStatus }) => ({ title, description, contractStatus }),
  });

  return (
    <Grid>
      <Breadcrumbs path={["dashboard", "erc20-contracts"]} />

      <PageHeader message="pages.erc20-contracts.title">
        <Button startIcon={<FilterList />} onClick={handleToggleFilters} data-testid="ToggleFilterButton">
          <FormattedMessage
            id={`form.buttons.${isFiltersOpen ? "hideFilters" : "showFilters"}`}
            data-testid="ToggleFiltersButton"
          />
        </Button>
        <Erc20ContractCreateButton onUpdate={fetch} />
        <Erc20TokenDeployButton />
      </PageHeader>

      <ContractSearchForm
        onSubmit={handleSearch}
        initialValues={search}
        open={isFiltersOpen}
        contractTemplateOptions={Erc20ContractTemplate}
      />

      <ProgressOverlay isLoading={isLoading}>
        <List>
          {rows.map((token, i) => (
            <ListItem key={i}>
              <ListItemText>{token.title}</ListItemText>
              <ListItemSecondaryAction>
                <IconButton onClick={handleEdit(token)}>
                  <Create />
                </IconButton>
                <IconButton onClick={handleDelete(token)} disabled={token.contractStatus === ContractStatus.INACTIVE}>
                  <Delete />
                </IconButton>
                <ContractActionsMenu
                  contract={token}
                  actions={[
                    ContractActions.SNAPSHOT,
                    token.contractTemplate === ContractTemplate.BLACKLIST ? ContractActions.BLACKLIST_ADD : null,
                    token.contractTemplate === ContractTemplate.BLACKLIST ? ContractActions.BLACKLIST_REMOVE : null,
                  ]}
                  disabled={
                    token.contractTemplate === ContractTemplate.EXTERNAL ||
                    token.contractTemplate === ContractTemplate.NATIVE
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
