import { FC } from "react";
import { Grid, List, ListItem, ListItemText, Pagination } from "@mui/material";

import { Breadcrumbs, PageHeader, ProgressOverlay } from "@gemunion/mui-page-layout";
import { useCollection } from "@gemunion/react-hooks";
import { AddressLink } from "@gemunion/mui-scanner";
import type { IUserSearchDto, IWalletPayee } from "@framework/types";

export const SystemPayees: FC = () => {
  const { rows, count, search, isLoading, handleChangePage } = useCollection<IWalletPayee, IUserSearchDto>({
    baseUrl: "/wallet/payees",
    empty: {},
    search: {},
    filter: ({ id: _id, ...rest }) => rest,
  });

  return (
    <Grid>
      <Breadcrumbs path={["dashboard", "wallet", "wallet.payees"]} />

      <PageHeader message="pages.wallet.payees.title"></PageHeader>

      <ProgressOverlay isLoading={isLoading}>
        <List>
          {rows.map((payee, i) => (
            <ListItem key={i}>
              <ListItemText sx={{ width: 0.2 }}>{payee.contract!.title}</ListItemText>
              <ListItemText sx={{ width: 0.6 }}>
                <AddressLink address={payee.account} />
              </ListItemText>
              <ListItemText sx={{ width: 0.2, textAlign: "right" }}>{payee.shares}</ListItemText>
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
    </Grid>
  );
};
