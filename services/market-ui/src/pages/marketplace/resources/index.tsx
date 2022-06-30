import { FC } from "react";
import { Grid, Pagination } from "@mui/material";
import { stringify } from "qs";

import { PageHeader, ProgressOverlay } from "@gemunion/mui-page-layout";
import { IErc1155TemplateSearchDto, ITemplate } from "@framework/types";
import { FormWrapper } from "@gemunion/mui-form";
import { useCollection } from "@gemunion/react-hooks";

import { ITabPanelProps, MarketplaceTabs } from "../tabs";
import { TokenItem } from "./item";
import { Erc1155TokenBatchBuyButton } from "../../../components/buttons";

export const Resources: FC<ITabPanelProps> = props => {
  const { value } = props;

  if (value !== MarketplaceTabs.resources) {
    return null;
  }

  const { rows, count, search, isLoading, handleChangePage } = useCollection<ITemplate, IErc1155TemplateSearchDto>({
    baseUrl: "/erc1155-tokens",
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
      data-testid="Resources"
    >
      <PageHeader message="pages.marketplace.resources.title">
        <Erc1155TokenBatchBuyButton rows={rows} />
      </PageHeader>

      <ProgressOverlay isLoading={isLoading}>
        <Grid container spacing={2}>
          {rows.map(token => (
            <Grid item lg={4} sm={6} xs={12} key={token.id}>
              <TokenItem template={token} />
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
