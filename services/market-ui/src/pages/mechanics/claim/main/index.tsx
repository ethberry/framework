import { FC, Fragment } from "react";
import { Button, List, ListItemText } from "@mui/material";
import { FilterList } from "@mui/icons-material";
import { useWeb3React } from "@web3-react/core";
import { FormattedMessage } from "react-intl";

import { Breadcrumbs, PageHeader, ProgressOverlay } from "@gemunion/mui-page-layout";
import { useCollection } from "@gemunion/react-hooks";
import { ListActions, StyledListItem, StyledPagination } from "@framework/styled";
import type { IClaim, IClaimSearchDto } from "@framework/types";
import { ClaimStatus, ClaimType } from "@framework/types";

import { formatItem } from "../../../../utils/money";
import { VestingDeployButton } from "../../../../components/buttons/mechanics/vesting/deploy";
import { ClaimRedeemButton } from "../../../../components/buttons";
import { ClaimSearchForm } from "./form";

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

  const date = new Date();

  return (
    <Fragment>
      <Breadcrumbs path={["dashboard", "claim"]} />
      <PageHeader message="pages.claim.title">
        <Button startIcon={<FilterList />} onClick={handleToggleFilters} data-testid="ToggleFilterButton">
          <FormattedMessage id={`form.buttons.${isFiltersOpen ? "hideFilters" : "showFilters"}`} />
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
            <StyledListItem key={claim.id} wrap>
              <ListItemText sx={{ width: { xs: 0.6, md: 0.2 } }}>{claim.claimType}</ListItemText>
              <ListItemText sx={{ width: { xs: 0.6, md: 0.2 } }}>{formatItem(claim.item)}</ListItemText>
              <ListActions>
                {claim.claimType === ClaimType.TOKEN ? (
                  <ClaimRedeemButton
                    claim={claim}
                    disabled={claim.claimStatus !== ClaimStatus.NEW || new Date(claim.endTimestamp) > date}
                  />
                ) : (
                  <VestingDeployButton claim={claim} />
                )}
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
    </Fragment>
  );
};
