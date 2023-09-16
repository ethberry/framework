import { FC, useState } from "react";
import { FormattedMessage } from "react-intl";
import { Button, Grid, List, ListItem, ListItemText, Pagination } from "@mui/material";
import { AccountBalanceWallet, FilterList, Visibility } from "@mui/icons-material";

import { Breadcrumbs, PageHeader, ProgressOverlay } from "@gemunion/mui-page-layout";
import { useCollection } from "@gemunion/react-hooks";
import type { ITemplate, IToken, ITokenSearchDto } from "@framework/types";
import { ModuleType, TokenStatus, TokenType } from "@framework/types";

import { TokenSearchForm } from "../../../../components/forms/token-search";
import { ListAction, ListActions } from "../../../../components/common/lists";
import { Erc998TokenViewDialog } from "./view";
import { BalanceWithdrawDialog } from "./withdraw-dialog";

export const Erc998Token: FC = () => {
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
    baseUrl: "/erc998/tokens",
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
        contractType={[TokenType.ERC998]}
        contractModule={[ModuleType.HIERARCHY]}
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
                <ListAction
                  onClick={handleWithdraw(token)}
                  icon={AccountBalanceWallet}
                  message="form.buttons.withdraw"
                />
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

      <Erc998TokenViewDialog
        onCancel={handleViewCancel}
        onConfirm={handleViewConfirm}
        open={isViewDialogOpen}
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
