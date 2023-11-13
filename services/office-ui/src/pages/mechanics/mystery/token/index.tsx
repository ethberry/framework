import { FC } from "react";
import { FormattedMessage } from "react-intl";
import { Button, Grid, List, ListItemText } from "@mui/material";
import { FilterList, Visibility } from "@mui/icons-material";

import { ListAction, ListActions, StyledListItem, StyledPagination } from "@framework/styled";
import type { ITemplate, IToken, ITokenSearchDto, IUser } from "@framework/types";
import { ModuleType, TokenStatus, TokenType } from "@framework/types";
import { Breadcrumbs, PageHeader, ProgressOverlay } from "@gemunion/mui-page-layout";
import { useUser } from "@gemunion/provider-user";
import { useCollection } from "@gemunion/react-hooks";

import { TokenSearchForm } from "../../../../components/forms/token-search";
import { Erc721TokenViewDialog } from "../../../hierarchy/erc721/token/view";

export const MysteryToken: FC = () => {
  const { profile } = useUser<IUser>();

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
    baseUrl: "/mystery/tokens",
    empty: {
      template: {} as ITemplate,
      metadata: "{}",
    },
    search: {
      tokenStatus: [TokenStatus.MINTED],
      contractIds: [],
      templateIds: [],
      metadata: {},
      merchantId: profile.merchantId,
    },
  });

  return (
    <Grid>
      <Breadcrumbs path={["dashboard", "mystery", "mystery.tokens"]} />

      <PageHeader message="pages.mystery.tokens.title">
        <Button startIcon={<FilterList />} onClick={handleToggleFilters} data-testid="ToggleFilterButton">
          <FormattedMessage id={`form.buttons.${isFiltersOpen ? "hideFilters" : "showFilters"}`} />
        </Button>
      </PageHeader>

      <TokenSearchForm
        onSubmit={handleSearch}
        initialValues={search}
        open={isFiltersOpen}
        contractModule={[ModuleType.MYSTERY]}
        contractType={[TokenType.ERC721]}
        onRefreshPage={handleRefreshPage}
      />

      <ProgressOverlay isLoading={isLoading}>
        <List>
          {rows.map(token => (
            <StyledListItem key={token.id}>
              <ListItemText>{token.template?.title}</ListItemText>
              <ListActions>
                <ListAction onClick={handleView(token)} message="form.tips.view" icon={Visibility} />
              </ListActions>
            </StyledListItem>
          ))}
        </List>
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
