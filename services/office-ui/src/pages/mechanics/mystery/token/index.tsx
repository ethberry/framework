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
import { FilterList, Visibility } from "@mui/icons-material";

import { Breadcrumbs, PageHeader, ProgressOverlay } from "@gemunion/mui-page-layout";
import { useUser } from "@gemunion/provider-user";
import type { ITemplate, IToken, ITokenSearchDto, IUser } from "@framework/types";
import { ModuleType, TokenStatus, TokenType } from "@framework/types";
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
      tokenId: "",
      metadata: {},
      merchantId: profile.merchantId,
    },
  });

  return (
    <Grid>
      <Breadcrumbs path={["dashboard", "mystery", "mystery.tokens"]} />

      <PageHeader message="pages.mystery.tokens.title">
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
        contractModule={[ModuleType.MYSTERY]}
        contractType={[TokenType.ERC721]}
      />

      <ProgressOverlay isLoading={isLoading}>
        <List>
          {rows.map(token => (
            <ListItem key={token.id}>
              <ListItemText>{token.template?.title}</ListItemText>
              <ListItemSecondaryAction>
                <IconButton onClick={handleView(token)}>
                  <Visibility />
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

      <Erc721TokenViewDialog
        onCancel={handleViewCancel}
        onConfirm={handleViewConfirm}
        open={isViewDialogOpen}
        initialValues={selected}
      />
    </Grid>
  );
};