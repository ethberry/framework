import { FC, Fragment } from "react";
import { Button, List, ListItem, ListItemSecondaryAction, ListItemText, Pagination } from "@mui/material";
import { Add } from "@mui/icons-material";
import { FormattedMessage } from "react-intl";
import { useWeb3React } from "@web3-react/core";

import { Breadcrumbs, PageHeader, ProgressOverlay } from "@gemunion/mui-page-layout";
import { useCollection } from "@gemunion/react-hooks";
import { IWaitlistItem, IWaitlistItemSearchDto } from "@framework/types";

import { ClaimWaitlistButton } from "../../../../components/buttons";
import { WaitlistJoinDialog } from "./join";

export const WaitlistItem: FC = () => {
  const { account } = useWeb3React();

  const {
    rows,
    count,
    search,
    selected,
    isLoading,
    isEditDialogOpen,
    handleCreate,
    handleEditConfirm,
    handleEditCancel,
    handleChangePage,
  } = useCollection<IWaitlistItem, IWaitlistItemSearchDto>({
    baseUrl: "/waitlist/item",
    empty: {
      account,
    },
  });

  return (
    <Fragment>
      <Breadcrumbs path={["dashboard", "waitlist", "waitlist.item"]} />

      <PageHeader message="pages.waitlist.item.title">
        <Button variant="outlined" startIcon={<Add />} onClick={handleCreate} data-testid="WrapperCreateButton">
          <FormattedMessage id="form.buttons.create" />
        </Button>
      </PageHeader>

      <ProgressOverlay isLoading={isLoading}>
        <List>
          {rows.map((waitlist, i) => (
            <ListItem key={i}>
              <ListItemText sx={{ width: 0.6 }}>{waitlist.account}</ListItemText>
              <ListItemText>{waitlist.list?.title}</ListItemText>
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

      <WaitlistJoinDialog
        onCancel={handleEditCancel}
        onConfirm={handleEditConfirm}
        open={isEditDialogOpen}
        initialValues={selected}
      />
    </Fragment>
  );
};
