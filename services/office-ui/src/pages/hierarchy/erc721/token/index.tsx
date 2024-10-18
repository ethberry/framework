import { FC } from "react";
import { FormattedMessage } from "react-intl";
import { Button, Grid, ListItemText } from "@mui/material";
import { FilterList, Visibility } from "@mui/icons-material";
import { useWeb3React } from "@web3-react/core";

import { Breadcrumbs, PageHeader } from "@ethberry/mui-page-layout";
import { CollectionActions, useCollection } from "@ethberry/provider-collection";
import { useUser } from "@ethberry/provider-user";
import { ListAction, ListActions, ListItem, StyledPagination } from "@framework/styled";
import type { ITemplate, IToken, ITokenSearchDto, IUser } from "@framework/types";
import { ModuleType, TokenStatus, TokenType } from "@framework/types";

import { WithCheckPermissionsListWrapper } from "../../../../components/wrappers";
import { TokenSearchForm } from "../../../../components/forms/token-search";
import { TokenRoyaltyButton } from "../../../../components/buttons";
import { Erc721TokenViewDialog } from "./view";

export const Erc721Token: FC = () => {
  const { profile } = useUser<IUser>();

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
    baseUrl: "/erc721/tokens",
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

  const { account = "" } = useWeb3React();

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
      />

      <WithCheckPermissionsListWrapper count={rows.length} isLoading={isLoading}>
        {rows.map(token => (
          <ListItem key={token.template!.contract!.id} account={account} contract={token.template!.contract}>
            <ListItemText>
              {token.template?.title} #{token.tokenId}
            </ListItemText>
            <ListActions>
              <ListAction onClick={handleView(token)} message="form.tips.view" icon={Visibility} />
              <TokenRoyaltyButton token={token} />
            </ListActions>
          </ListItem>
        ))}
      </WithCheckPermissionsListWrapper>

      <StyledPagination
        shape="rounded"
        page={search.skip / search.take + 1}
        count={Math.ceil(count / search.take)}
        onChange={handleChangePage}
      />

      <Erc721TokenViewDialog
        onCancel={handleViewCancel}
        onConfirm={handleViewConfirm}
        open={action === CollectionActions.view}
        initialValues={selected}
      />
    </Grid>
  );
};
