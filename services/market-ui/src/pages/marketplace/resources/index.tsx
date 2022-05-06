import { FC } from "react";
import { Grid, Pagination } from "@mui/material";
import { stringify } from "qs";

import { ProgressOverlay } from "@gemunion/mui-progress";
import { PageHeader } from "@gemunion/mui-page-header";
import { IErc1155Token, IErc1155TokenSearchDto } from "@framework/types";
import { FormikForm } from "@gemunion/mui-form";
import { useCollection } from "@gemunion/react-hooks";

import { ITabPanelProps, MarketplaceTabs } from "../tabs";
import { TokenItem } from "./item";
import { Erc1155TokenBatchBuyButton } from "../../../components/buttons/erc1155/token-batch-buy";

export const Resources: FC<ITabPanelProps> = props => {
  const { value } = props;

  if (value !== MarketplaceTabs.resources) {
    return null;
  }

  const { rows, count, search, isLoading, handleChangePage } = useCollection<IErc1155Token, IErc1155TokenSearchDto>({
    baseUrl: "/erc1155-tokens",
    search: {
      erc1155CollectionIds: [1],
    },
    redirect: (_baseUrl, search) => `/marketplace/${value}?${stringify(search)}`,
  });

  const initialValues = rows.reduce((memo, current) => Object.assign(memo, { [current.tokenId]: 0 }), {});

  return (
    <FormikForm
      initialValues={initialValues}
      onSubmit={() => {}}
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
              <TokenItem token={token} />
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
    </FormikForm>
  );
};
