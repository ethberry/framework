import { FC } from "react";
import { Grid, Pagination } from "@mui/material";
import { stringify } from "qs";

import { PageHeader, ProgressOverlay } from "@gemunion/mui-page-layout";
import { ITemplate, ITemplateSearchDto } from "@framework/types";
import { FormWrapper } from "@gemunion/mui-form";
import { useCollection } from "@gemunion/react-hooks";

import { ITabPanelProps, MarketplaceTabs } from "../tabs";
import { Erc1155Template } from "../../../erc1155/template-list/item";

export const Erc1155: FC<ITabPanelProps> = props => {
  const { value } = props;

  if (value !== MarketplaceTabs.erc1155) {
    return null;
  }

  const { rows, count, search, isLoading, handleChangePage } = useCollection<ITemplate, ITemplateSearchDto>({
    baseUrl: "/erc1155-templates",
    search: {
      contractIds: [],
    },
    redirect: (_baseUrl, search) => `/marketplace/${value}?${stringify(search)}`,
  });

  const initialValues = rows.reduce((memo, current) => Object.assign(memo, { [current.id]: 0 }), {});

  return (
    <FormWrapper
      initialValues={initialValues}
      onSubmit={Promise.resolve}
      showButtons={false}
      showPrompt={false}
      testId="Resources"
    >
      <PageHeader message="pages.marketplace.erc1155.title" />

      <ProgressOverlay isLoading={isLoading}>
        <Grid container spacing={2}>
          {rows.map(template => (
            <Grid item lg={4} sm={6} xs={12} key={template.id}>
              <Erc1155Template template={template} />
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
    </FormWrapper>
  );
};
