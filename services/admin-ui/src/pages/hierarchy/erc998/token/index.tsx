import { FC, useState } from "react";
import { FormattedMessage } from "react-intl";
import { Button, Grid, ListItemText } from "@mui/material";
import { AccountBalanceWallet, FilterList, Visibility } from "@mui/icons-material";

import { Breadcrumbs, PageHeader, ProgressOverlay } from "@ethberry/mui-page-layout";
import { useCollection, CollectionActions } from "@ethberry/provider-collection";
import { ListAction, ListActions, StyledListItem, StyledListWrapper, StyledPagination } from "@framework/styled";
import type { ITemplate, IToken, ITokenSearchDto } from "@framework/types";
import { ModuleType, TokenStatus, TokenType } from "@framework/types";

import { TokenSearchForm } from "../../../../components/forms/token-search";
import { Erc998TokenViewDialog } from "./view";
import { BalanceWithdrawDialog } from "./withdraw-dialog";

export const Erc998Token: FC = () => {
  const {
    rows,
    count,
    search,
    action,
    selected,
    isLoading,
    isFiltersOpen,
    handleToggleFilters,
    handleView,
    handleViewCancel,
    handleViewConfirm,
    handleSearch,
    handleChangePage,
  } = useCollection<IToken, ITokenSearchDto>({
    baseUrl: "/erc998/tokens",
    empty: {
      template: {} as ITemplate,
      metadata: "{}",
    },
    search: {
      tokenStatus: [TokenStatus.MINTED],
      contractIds: [],
      templateIds: [],
      metadata: {},
    },
  });

  const [isWithdrawDialogOpen, setIsWithdrawDialogOpen] = useState(false);

  const [token, setToken] = useState<IToken>({} as IToken);

  const handleWithdraw = (token: IToken): (() => void) => {
    return (): void => {
      setToken(token);
      setIsWithdrawDialogOpen(true);
    };
  };

  const handleWithdrawConfirm = () => {
    setIsWithdrawDialogOpen(false);
  };

  const handleWithdrawCancel = () => {
    setIsWithdrawDialogOpen(false);
  };

  return (
    <Grid>
      <Breadcrumbs path={["dashboard", "erc998", "erc998.tokens"]} />

      <PageHeader message="pages.erc998.tokens.title">
        <Button startIcon={<FilterList />} onClick={handleToggleFilters} data-testid="ToggleFilterButton">
          <FormattedMessage id={`form.buttons.${isFiltersOpen ? "hideFilters" : "showFilters"}`} />
        </Button>
      </PageHeader>

      <TokenSearchForm
        onSubmit={handleSearch}
        initialValues={search}
        open={isFiltersOpen}
        contractType={[TokenType.ERC998]}
        contractModule={[ModuleType.HIERARCHY]}
      />

      <ProgressOverlay isLoading={isLoading}>
        <StyledListWrapper count={rows.length} isLoading={isLoading}>
          {rows.map(token => (
            <StyledListItem key={token.id}>
              <ListItemText>
                {token.template?.title} #{token.tokenId}
              </ListItemText>
              <ListActions>
                <ListAction
                  onClick={handleWithdraw(token)}
                  icon={AccountBalanceWallet}
                  message="form.buttons.withdraw"
                />
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

      <Erc998TokenViewDialog
        onCancel={handleViewCancel}
        onConfirm={handleViewConfirm}
        open={action === CollectionActions.view}
        initialValues={selected}
      />

      <BalanceWithdrawDialog
        onConfirm={handleWithdrawConfirm}
        onCancel={handleWithdrawCancel}
        open={isWithdrawDialogOpen}
        initialValues={token}
      />
    </Grid>
  );
};
