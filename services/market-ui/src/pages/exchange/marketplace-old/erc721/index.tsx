import { FC } from "react";
import { Grid, Pagination } from "@mui/material";
import { stringify } from "qs";

import { PageHeader, ProgressOverlay } from "@gemunion/mui-page-layout";
import type { ITemplate, ITemplateSearchDto } from "@framework/types";
import { useCollection } from "@gemunion/react-hooks";

import { Erc721TemplateListItem } from "../../../hierarchy/erc721/template-list/item";
import { ITabPanelProps, MarketplaceTabs } from "../tabs";

export const Erc721: FC<ITabPanelProps> = props => {
  const { value } = props;

  if (value !== MarketplaceTabs.erc721) {
    return null;
  }

  const { rows, count, search, isLoading, handleChangePage } = useCollection<ITemplate, ITemplateSearchDto>({
    baseUrl: "/erc721/templates",
    search: {
      contractIds: [], // Erc721 Items
    },
    redirect: (_baseUrl, search) => `/marketplace/${value}?${stringify(search)}`,
  });

  return (
    <Grid>
      <PageHeader message="pages.marketplace.erc721.title" />

      <ProgressOverlay isLoading={isLoading}>
        <Grid container spacing={2}>
          {rows.map(template => (
            <Grid item lg={4} sm={6} xs={12} key={template.id}>
              <Erc721TemplateListItem template={template} />
            </Grid>
          ))}
        </Grid>
      </ProgressOverlay>

      <Pagination
        sx={{ mt: 2 }}
        shape="rounded"
        page={search.skip / search.take + 1}
        count={Math.ceil(count / search.take)}
        onChange={handleChangePage}
      />
    </Grid>
  );
};
