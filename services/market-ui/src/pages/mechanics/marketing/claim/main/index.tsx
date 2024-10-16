import { FC, Fragment } from "react";
import { Button, ListItemText } from "@mui/material";
import { FilterList } from "@mui/icons-material";
import { FormattedMessage } from "react-intl";

import { Breadcrumbs, PageHeader, ProgressOverlay } from "@ethberry/mui-page-layout";
import { useCollection } from "@ethberry/provider-collection";
import { formatItem } from "@framework/exchange";
import { ListActions, StyledListItem, StyledListWrapper, StyledPagination } from "@framework/styled";
import type { IClaim, IClaimSearchDto } from "@framework/types";
import { ClaimStatus, ClaimType } from "@framework/types";

import { ClaimRedeemTemplateButton, ClaimRedeemTokenButton } from "../../../../../components/buttons";
import { ClaimSearchForm } from "./form";

export const Claim: FC = () => {
  const { rows, count, search, isLoading, isFiltersOpen, handleSearch, handleToggleFilters, handleChangePage } =
    useCollection<IClaim, IClaimSearchDto>({
      baseUrl: "/claim",
      search: {
        claimStatus: [ClaimStatus.NEW],
        claimType: [ClaimType.TOKEN, ClaimType.TEMPLATE],
      },
    });

  return (
    <Fragment>
      <Breadcrumbs path={["dashboard", "claim"]} />
      <PageHeader message="pages.claim.title">
        <Button startIcon={<FilterList />} onClick={handleToggleFilters} data-testid="ToggleFilterButton">
          <FormattedMessage id={`form.buttons.${isFiltersOpen ? "hideFilters" : "showFilters"}`} />
        </Button>
      </PageHeader>

      <ClaimSearchForm onSubmit={handleSearch} initialValues={search} open={isFiltersOpen} />

      <ProgressOverlay isLoading={isLoading}>
        <StyledListWrapper count={rows.length} isLoading={isLoading}>
          {rows.map(claim => (
            <StyledListItem key={claim.id} wrap>
              <ListItemText sx={{ width: { xs: 0.6, md: 0.2 } }}>{claim.claimType}</ListItemText>
              <ListItemText sx={{ width: { xs: 0.6, md: 0.2 } }}>{formatItem(claim.item)}</ListItemText>
              <ListActions>
                {claim.claimType === ClaimType.TEMPLATE ? <ClaimRedeemTemplateButton claim={claim} /> : null}
                {claim.claimType === ClaimType.TOKEN ? <ClaimRedeemTokenButton claim={claim} /> : null}
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
    </Fragment>
  );
};
