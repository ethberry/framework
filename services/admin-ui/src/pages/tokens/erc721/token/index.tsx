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
import { useCollection } from "@gemunion/react-hooks";
import { ITemplate, IToken, ITokenSearchDto, ModuleType, TokenStatus, TokenType } from "@framework/types";

import { Erc721TokenViewDialog } from "./view";
import { TokenSearchForm } from "../../../../components/forms/token-search";

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
  } = useCollection<IToken, ITokenSearchDto>({
    baseUrl: "/erc721-tokens",
    empty: {
      template: {} as ITemplate,
      attributes: "{}",
    },
    search: {
      tokenStatus: [TokenStatus.MINTED],
      contractIds: [],
      templateIds: [],
      tokenId: "",
      attributes: {},
    },
  });

  return (
    <Grid>
      <Breadcrumbs path={["dashboard", "erc721.tokens"]} />

      <PageHeader message="pages.erc721.tokens.title">
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
        contractModule={[ModuleType.HIERARCHY]}
        contractType={[TokenType.ERC721]}
      />

      <ProgressOverlay isLoading={isLoading}>
        <List>
          {rows.map((token, i) => (
            <ListItem key={i}>
              <ListItemText>
                {token.template?.title} #{token.tokenId}
              </ListItemText>
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
