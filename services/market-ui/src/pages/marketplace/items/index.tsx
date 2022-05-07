import { FC } from "react";
import { Grid, Pagination } from "@mui/material";
import { stringify } from "qs";

import { PageHeader, ProgressOverlay } from "@gemunion/mui-page-layout";
import { IErc721Template, IErc721TemplateSearchDto } from "@framework/types";
import { useCollection } from "@gemunion/react-hooks";

import { ITabPanelProps, MarketplaceTabs } from "../tabs";
import { TemplateItem } from "../../erc721/template-list/item";

export const Items: FC<ITabPanelProps> = props => {
  const { value } = props;

  if (value !== MarketplaceTabs.items) {
    return null;
  }

  const { rows, count, search, isLoading, handleChangePage } = useCollection<IErc721Template, IErc721TemplateSearchDto>(
    {
      baseUrl: "/erc721-templates",
      search: {
        erc721CollectionIds: [1], // Items
      },
      redirect: (_baseUrl, search) => `/marketplace/${value}?${stringify(search)}`,
    },
  );

  return (
    <Grid>
      <PageHeader message="pages.marketplace.items.title" />

      <ProgressOverlay isLoading={isLoading}>
        <Grid container spacing={2}>
          {rows.map(template => (
            <Grid item lg={4} sm={6} xs={12} key={template.id}>
              <TemplateItem template={template} />
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
