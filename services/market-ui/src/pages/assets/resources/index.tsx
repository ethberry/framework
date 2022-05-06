import { FC } from "react";
import { Grid, Pagination } from "@mui/material";
import { stringify } from "qs";

import { PageHeader } from "@gemunion/mui-page-header";
import { IPaginationDto } from "@gemunion/types-collection";
import { IErc1155Balance } from "@framework/types";
import { ProgressOverlay } from "@gemunion/mui-progress";
import { useCollection } from "@gemunion/react-hooks";

import { Erc1155Token } from "./item";
import { AssetsTabs, ITabPanelProps } from "../tabs";

export const Resources: FC<ITabPanelProps> = props => {
  const { value } = props;

  if (value !== AssetsTabs.resources) {
    return null;
  }

  const { rows, count, search, isLoading, handleChangePage } = useCollection<IErc1155Balance, IPaginationDto>({
    baseUrl: "/erc1155-balances",
    redirect: (_baseUrl, search) => `/assets/${value}?${stringify(search)}`,
  });

  return (
    <Grid>
      <PageHeader message="pages.assets.title" />

      <ProgressOverlay isLoading={isLoading}>
        <Grid container spacing={2}>
          {rows.map(balance => (
            <Grid item lg={4} sm={6} xs={12} key={balance.id}>
              <Erc1155Token token={balance.erc1155Token!} />
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
