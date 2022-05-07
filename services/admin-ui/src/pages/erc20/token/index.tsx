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
import { Add, Create, FilterList } from "@mui/icons-material";

import { Breadcrumbs, PageHeader, ProgressOverlay } from "@gemunion/mui-page-layout";
import { Erc20TokenStatus, IErc20Token, IErc20TokenSearchDto } from "@framework/types";
import { useCollection } from "@gemunion/react-hooks";

import { Erc20TokenEditDialog } from "./edit";
import { Erc20TokenSearchForm } from "./form";
import { Erc20SnapshotButton } from "../../../components/buttons";

export const Erc20Token: FC = () => {
  const {
    rows,
    count,
    search,
    selected,
    isLoading,
    isFiltersOpen,
    isEditDialogOpen,
    handleToggleFilters,
    handleAdd,
    handleEdit,
    handleEditCancel,
    handleEditConfirm,
    handleSubmit,
    handleChangePage,
  } = useCollection<IErc20Token, IErc20TokenSearchDto>({
    baseUrl: "/erc20-tokens",
    empty: {
      title: "",
      description: "",
      symbol: "",
    },
    search: {
      query: "",
      tokenStatus: [Erc20TokenStatus.ACTIVE],
    },
    filter: ({ id, title, description, symbol, amount }) =>
      id
        ? { description }
        : {
            title,
            description,
            symbol,
            amount,
          },
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
        <Button
          variant="outlined"
          startIcon={<Add />}
          onClick={handleAdd}
          disabled
          data-testid="erc721CollectionAddButton"
        >
          <FormattedMessage id="form.buttons.add" />
        </Button>
      </PageHeader>

      <Erc20TokenSearchForm onSubmit={handleSubmit} initialValues={search} open={isFiltersOpen} />

      <ProgressOverlay isLoading={isLoading}>
        <List>
          {rows.map((token, i) => (
            <ListItem key={i}>
              <ListItemText>{token.title}</ListItemText>
              <ListItemSecondaryAction>
                <Erc20SnapshotButton />
                <IconButton onClick={handleEdit(token)}>
                  <Create />
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

      <Erc20TokenEditDialog
        onCancel={handleEditCancel}
        onConfirm={handleEditConfirm}
        open={isEditDialogOpen}
        initialValues={selected}
      />
    </Grid>
  );
};
