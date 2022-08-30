import { FC, Fragment } from "react";
import { Button, List, ListItem, ListItemSecondaryAction, ListItemText, Pagination } from "@mui/material";
import { FilterList } from "@mui/icons-material";
import { useWeb3React } from "@web3-react/core";
import { FormattedMessage } from "react-intl";

import { Breadcrumbs, PageHeader, ProgressOverlay } from "@gemunion/mui-page-layout";
import { useCollection } from "@gemunion/react-hooks";
import type { IClaim, IClaimSearchDto } from "@framework/types";
import { ClaimStatus } from "@framework/types";

import { ClaimRedeemButton } from "../../../../components/buttons";
import { ClaimSearchForm } from "./form";

export const Claim: FC = () => {
  const { account } = useWeb3React();

  const { rows, count, search, isLoading, isFiltersOpen, handleSearch, handleToggleFilters, handleChangePage } =
    useCollection<IClaim, IClaimSearchDto>({
      baseUrl: `/claim`,
      search: {
        account,
        claimStatus: [ClaimStatus.NEW],
      },
    });

  return (
    <Fragment>
      <Breadcrumbs path={["dashboard", "claim"]} />

      <PageHeader message="pages.claim.title">
        <Button startIcon={<FilterList />} onClick={handleToggleFilters}>
          <FormattedMessage
            id={`form.buttons.${isFiltersOpen ? "hideFilters" : "showFilters"}`}
            data-testid="ToggleFiltersButton"
          />
        </Button>
      </PageHeader>

      <ClaimSearchForm onSubmit={handleSearch} initialValues={search} open={isFiltersOpen}></ClaimSearchForm>

      <ProgressOverlay isLoading={isLoading}>
        <List>
          {rows.map((claim, i) => (
            <ListItem key={i}>
              <ListItemText sx={{ width: 0.6 }}>{claim.item.components[0]?.template?.title}</ListItemText>
              <ListItemText>{claim.claimStatus}</ListItemText>
              <ListItemSecondaryAction>
                <ClaimRedeemButton claim={claim} />
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
    </Fragment>
  );
};
