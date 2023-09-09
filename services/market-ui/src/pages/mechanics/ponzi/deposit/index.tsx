import { FC } from "react";
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
import { FormattedMessage } from "react-intl";

import { Breadcrumbs, PageHeader, ProgressOverlay } from "@gemunion/mui-page-layout";
import type { IPonziDeposit, IPonziDepositSearchDto } from "@framework/types";
import { PonziDepositStatus, TokenType } from "@framework/types";
import { useCollection } from "@gemunion/react-hooks";

import { PonziDepositSearchForm } from "./form";
import { StakesViewDialog } from "./view";
import { PonziRewardComplexButton } from "../../../../components/buttons";

export const PonziDeposit: FC = () => {
  const {
    rows,
    count,
    search,
    selected,
    isLoading,
    isFiltersOpen,
    handleToggleFilters,
    isViewDialogOpen,
    handleView,
    handleViewConfirm,
    handleViewCancel,
    handleSearch,
    handleChangePage,
  } = useCollection<IPonziDeposit, IPonziDepositSearchDto>({
    baseUrl: "/ponzi/stakes",
    search: {
      ponziDepositStatus: [PonziDepositStatus.ACTIVE],
      deposit: {
        tokenType: [] as Array<TokenType>,
        contractIds: [],
      },
      reward: {
        tokenType: [] as Array<TokenType>,
        contractIds: [],
      },
    },
  });

  return (
    <Grid>
      <Breadcrumbs path={["dashboard", "ponzi", "ponzi.deposit"]} />

      <PageHeader message="pages.ponzi.deposit.title">
        <Button startIcon={<FilterList />} onClick={handleToggleFilters} data-testid="ToggleFilterButton">
          <FormattedMessage id={`form.buttons.${isFiltersOpen ? "hideFilters" : "showFilters"}`} />
        </Button>
      </PageHeader>

      <PonziDepositSearchForm onSubmit={handleSearch} initialValues={search} open={isFiltersOpen} />

      <ProgressOverlay isLoading={isLoading}>
        <List>
          {rows.map(stake => (
            <ListItem key={stake.id}>
              <ListItemText>{stake.ponziRule?.title}</ListItemText>
              <ListItemSecondaryAction>
                <PonziRewardComplexButton stake={stake} />
                <IconButton onClick={handleView(stake)}>
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

      <StakesViewDialog
        onCancel={handleViewCancel}
        onConfirm={handleViewConfirm}
        open={isViewDialogOpen}
        initialValues={selected}
      />
    </Grid>
  );
};
