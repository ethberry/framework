import { FC } from "react";
import { Grid, List, ListItem, ListItemText, Pagination } from "@mui/material";

import { Breadcrumbs, PageHeader, ProgressOverlay } from "@gemunion/mui-page-layout";
import { useCollection } from "@gemunion/react-hooks";
import { IUserSearchDto, IWalletPayee } from "@framework/types";

export const SystemPayees: FC = () => {
  const { rows, count, search, isLoading, handleChangePage } = useCollection<IWalletPayee, IUserSearchDto>({
    baseUrl: "/payees",
    empty: {},
    search: {},
    filter: ({ id: _id, ...rest }) => rest,
  });

  return (
    <Grid>
      <Breadcrumbs path={["dashboard", "payees"]} />

      <PageHeader message="pages.payees.title"></PageHeader>

      <ProgressOverlay isLoading={isLoading}>
        <List>
          {rows.map((payee, i) => (
            <ListItem key={i}>
              <ListItemText>{payee.account}</ListItemText>
              <ListItemText>{payee.shares}%</ListItemText>
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
