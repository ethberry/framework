import { FC } from "react";
import { FormattedMessage } from "react-intl";
import { Button, Grid, ListItemText } from "@mui/material";
import { FilterList, Visibility } from "@mui/icons-material";

import { Breadcrumbs, PageHeader, ProgressOverlay } from "@gemunion/mui-page-layout";
import { useCollection } from "@gemunion/react-hooks";
import { ListAction, ListActions, StyledListItem, StyledListWrapper, StyledPagination } from "@framework/styled";
import type { ITemplate, IToken, ITokenSearchDto } from "@framework/types";
import { ModuleType, TokenStatus, TokenType } from "@framework/types";

import { TokenSearchForm } from "../../../../components/forms/token-search";
import { Erc721TokenViewDialog } from "./view";

export const Erc721Token: FC = () => {
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
    baseUrl: "/erc721/tokens",
    empty: {
      template: {
        box: {},
      } as unknown as ITemplate,
      metadata: "{}",
    },
    search: {
      tokenStatus: [TokenStatus.MINTED],
      contractIds: [],
      templateIds: [],
      metadata: {},
    },
  });

  return (
    <Grid>
      <Breadcrumbs path={["dashboard", "erc721", "erc721.tokens"]} />

      <PageHeader message="pages.erc721.tokens.title">
        <Button startIcon={<FilterList />} onClick={handleToggleFilters} data-testid="ToggleFilterButton">
          <FormattedMessage id={`form.buttons.${isFiltersOpen ? "hideFilters" : "showFilters"}`} />
        </Button>
      </PageHeader>

      <TokenSearchForm
        onSubmit={handleSearch}
        initialValues={search}
        open={isFiltersOpen}
        contractModule={[ModuleType.HIERARCHY]}
        contractType={[TokenType.ERC721]}
        onRefreshPage={handleRefreshPage}
      />

      <ProgressOverlay isLoading={isLoading}>
        <StyledListWrapper count={rows.length} isLoading={isLoading}>
          {rows.map(token => (
            <StyledListItem key={token.id}>
              <ListItemText>
                {token.template?.title} #{token.tokenId}
              </ListItemText>
              <ListActions>
                <ListAction onClick={handleView(token)} message="form.tips.view" icon={Visibility} />
              </ListActions>
            </StyledListItem>
          ))}
        </StyledListWrapper>
      </ProgressOverlay>

      <StyledPagination
        shape="rounded"
        page={search.skip / search.take + 1}
        count={Math.ceil(count / search.take)}
        onChange={handleChangePage}
      />

      <Erc721TokenViewDialog
        onCancel={handleViewCancel}
        onConfirm={handleViewConfirm}
        open={isViewDialogOpen}
        initialValues={selected}
      />
    </Grid>
  );
};
