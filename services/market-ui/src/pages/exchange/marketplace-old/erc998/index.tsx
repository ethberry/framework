import { FC } from "react";
import { Grid } from "@mui/material";
import { stringify } from "qs";

import { PageHeader, ProgressOverlay } from "@gemunion/mui-page-layout";
import { useCollection } from "@gemunion/provider-collection";
import { StyledEmptyWrapper, StyledPagination } from "@framework/styled";
import type { ITemplate, ITemplateSearchDto } from "@framework/types";

import { Erc721TemplateListItem } from "../../../hierarchy/erc721/template-list/item";
import type { ITabPanelProps } from "../tabs";
import { MarketplaceTabs } from "../tabs";

export const Erc998: FC<ITabPanelProps> = props => {
  const { value } = props;

  if (value !== MarketplaceTabs.erc998) {
    return null;
  }

  const { rows, count, search, isLoading, handleChangePage } = useCollection<ITemplate, ITemplateSearchDto>({
    baseUrl: "/erc998/templates",
    search: {
      contractIds: [],
    },
    redirect: (_baseUrl, search) => `/marketplace/${value}?${stringify(search)}`,
  });

  return (
    <Grid>
      <PageHeader message="pages.marketplace.erc998.title" />

      <ProgressOverlay isLoading={isLoading}>
        <Grid container spacing={2}>
          <StyledEmptyWrapper count={rows.length} isLoading={isLoading}>
            {rows.map(template => (
              <Grid item lg={4} sm={6} xs={12} key={template.id}>
                <Erc721TemplateListItem template={template} />
              </Grid>
            ))}
          </StyledEmptyWrapper>
        </Grid>
      </ProgressOverlay>

      <StyledPagination
        shape="rounded"
        page={search.skip / search.take + 1}
        count={Math.ceil(count / search.take)}
        onChange={handleChangePage}
      />
    </Grid>
  );
};
