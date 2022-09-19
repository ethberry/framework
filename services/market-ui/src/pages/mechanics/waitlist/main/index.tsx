import { FC, Fragment } from "react";
import { List, ListItem, ListItemSecondaryAction, ListItemText, Pagination } from "@mui/material";

import { Breadcrumbs, PageHeader, ProgressOverlay } from "@gemunion/mui-page-layout";
import { useCollection } from "@gemunion/react-hooks";
import { IWaitlist, IWaitlistSearchDto } from "@framework/types";
import { ClaimWaitlistButton } from "../../../../components/buttons";

export interface IProof {
  proof: Array<string>;
}

export interface IRoot {
  root: string;
}

export const Waitlist: FC = () => {
  const { rows, count, search, isLoading, handleChangePage } = useCollection<IWaitlist, IWaitlistSearchDto>({
    baseUrl: "/waitlist",
  });

  return (
    <Fragment>
      <Breadcrumbs path={["dashboard", "waitlist"]} />

      <PageHeader message="pages.waitlist.title"></PageHeader>

      <ProgressOverlay isLoading={isLoading}>
        <List>
          {rows.map((waitlist, i) => (
            <ListItem key={i}>
              <ListItemText>{waitlist.account}</ListItemText>
              <ListItemText>{waitlist.listId}</ListItemText>
              <ListItemSecondaryAction>
                <ClaimWaitlistButton listId={waitlist.listId} />
              </ListItemSecondaryAction>
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
    </Fragment>
  );
};
