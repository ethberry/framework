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
import { Create, FilterList } from "@mui/icons-material";

import { Breadcrumbs, PageHeader, ProgressOverlay } from "@gemunion/mui-page-layout";
import { UniTokenStatus, IUniTemplate, IUniToken, IErc998TokenSearchDto } from "@framework/types";
import { useCollection } from "@gemunion/react-hooks";

import { Erc998TokenEditDialog } from "./edit";
import { Erc998TokenSearchForm } from "./form";

export const Erc998Token: FC = () => {
  const {
    rows,
    count,
    search,
    selected,
    isLoading,
    isFiltersOpen,
    isEditDialogOpen,
    handleToggleFilters,
    handleEdit,
    handleEditCancel,
    handleEditConfirm,
    handleSearch,
    handleChangePage,
  } = useCollection<IUniToken, IErc998TokenSearchDto>({
    baseUrl: "/erc998-tokens",
    empty: {
      uniTemplate: {} as IUniTemplate,
    },
    search: {
      query: "",
      tokenStatus: [UniTokenStatus.MINTED],
      rarity: [],
      uniContractIds: [],
      tokenId: "",
    },
    filter: ({ attributes }) => ({ attributes }),
  });

  return (
    <Grid>
      <Breadcrumbs path={["dashboard", "erc998-tokens"]} />

      <PageHeader message="pages.erc998-tokens.title">
        <Button startIcon={<FilterList />} onClick={handleToggleFilters} data-testid="ToggleFilterButton">
          <FormattedMessage
            id={`form.buttons.${isFiltersOpen ? "hideFilters" : "showFilters"}`}
            data-testid="ToggleFiltersButton"
          />
        </Button>
      </PageHeader>

      <Erc998TokenSearchForm onSubmit={handleSearch} initialValues={search} open={isFiltersOpen} />

      <ProgressOverlay isLoading={isLoading}>
        <List>
          {rows.map((token, i) => (
            <ListItem key={i}>
              <ListItemText>{token.uniTemplate?.title}</ListItemText>
              <ListItemSecondaryAction>
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

      <Erc998TokenEditDialog
        onCancel={handleEditCancel}
        onConfirm={handleEditConfirm}
        open={isEditDialogOpen}
        initialValues={selected}
      />
    </Grid>
  );
};
