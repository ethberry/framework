import { FC } from "react";
import { FormattedMessage } from "react-intl";
import { Button, Grid, List, ListItem, ListItemText, Pagination } from "@mui/material";
import { FilterList, Visibility } from "@mui/icons-material";

import { Breadcrumbs, PageHeader, ProgressOverlay } from "@gemunion/mui-page-layout";
import { useCollection } from "@gemunion/react-hooks";
import type { ITemplate, IToken, ITokenSearchDto } from "@framework/types";
import { ModuleType, TokenStatus, TokenType } from "@framework/types";

import { TokenSearchForm } from "../../../../components/forms/token-search";
import { ListAction, ListActions } from "../../../../components/common/lists";
import { CollectionTokenViewDialog } from "./view";

export const CollectionToken: FC = () => {
  const {
    rows,
    count,
    search,
    selected,
    isLoading,
    isFiltersOpen,
    isViewDialogOpen,
    handleToggleFilters,
    handleView,
    handleViewCancel,
    handleViewConfirm,
    handleSearch,
    handleChangePage,
    handleRefreshPage,
  } = useCollection<IToken, ITokenSearchDto>({
    baseUrl: "/collection/tokens",
    empty: {
      template: {} as ITemplate,
      metadata: "{}",
    },
    search: {
      tokenStatus: [TokenStatus.MINTED],
      contractIds: [],
      templateIds: [],
      tokenId: "",
      metadata: {},
    },
  });

  return (
    <Grid>
      <Breadcrumbs path={["dashboard", "collection", "collection.token"]} />

      <PageHeader message="pages.collection.tokens">
        <Button startIcon={<FilterList />} onClick={handleToggleFilters} data-testid="ToggleFilterButton">
          <FormattedMessage
            id={`form.buttons.${isFiltersOpen ? "hideFilters" : "showFilters"}`}
            data-testid="ToggleFiltersButton"
          />
        </Button>
      </PageHeader>

      <TokenSearchForm
        onSubmit={handleSearch}
        initialValues={search}
        open={isFiltersOpen}
        contractModule={[ModuleType.COLLECTION]}
        contractType={[TokenType.ERC721]}
        onRefreshPage={handleRefreshPage}
      />

      <ProgressOverlay isLoading={isLoading}>
        <List>
          {rows.map(token => (
            <ListItem key={token.id}>
              <ListItemText>
                {token.template?.title} #{token.tokenId}
              </ListItemText>
              <ListActions>
                <ListAction onClick={handleView(token)} icon={Visibility} message="form.tips.view" />
              </ListActions>
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

      <CollectionTokenViewDialog
        onCancel={handleViewCancel}
        onConfirm={handleViewConfirm}
        open={isViewDialogOpen}
        initialValues={selected}
      />
    </Grid>
  );
};
