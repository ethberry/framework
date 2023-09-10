import { FC, Fragment } from "react";
import { Button, List, ListItem, ListItemSecondaryAction, ListItemText, Pagination } from "@mui/material";
import { FilterList } from "@mui/icons-material";
import { useWeb3React } from "@web3-react/core";
import { FormattedMessage } from "react-intl";

import { Breadcrumbs, PageHeader, ProgressOverlay } from "@gemunion/mui-page-layout";
import { useCollection } from "@gemunion/react-hooks";
import type { IClaim, IClaimSearchDto } from "@framework/types";
import { ClaimStatus, ClaimType } from "@framework/types";

import { VestingDeployButton } from "../../../../components/buttons/mechanics/vesting/deploy";
import { ClaimRedeemButton } from "../../../../components/buttons";
import { ClaimSearchForm } from "./form";
import { formatItem } from "../../../../utils/money";

export const Claim: FC = () => {
  const { account } = useWeb3React();

  const {
    rows,
    count,
    search,
    isLoading,
    isFiltersOpen,
    handleSearch,
    handleToggleFilters,
    handleChangePage,
    handleRefreshPage,
  } = useCollection<IClaim, IClaimSearchDto>({
    baseUrl: `/claim`,
    search: {
      account,
      claimStatus: [ClaimStatus.NEW],
      claimType: [ClaimType.VESTING, ClaimType.TOKEN],
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

      <ClaimSearchForm
        onSubmit={handleSearch}
        initialValues={search}
        open={isFiltersOpen}
        onRefreshPage={handleRefreshPage}
      />

      <ProgressOverlay isLoading={isLoading}>
        <List>
          {rows.map(claim => (
            <ListItem key={claim.id} sx={{ flexWrap: "wrap" }}>
              <ListItemText sx={{ width: { xs: 0.6, md: 0.2 } }}>{claim.claimType}</ListItemText>
              <ListItemText sx={{ width: { xs: 0.6, md: 0.2 } }}>{formatItem(claim.item)}</ListItemText>
              <ListItemSecondaryAction>
                {claim.claimType === ClaimType.TOKEN ? (
                  <ClaimRedeemButton claim={claim} />
                ) : (
                  <VestingDeployButton claim={claim} />
                )}
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
