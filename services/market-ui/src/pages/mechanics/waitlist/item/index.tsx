import { FC, Fragment } from "react";
import { Button, List, ListItem, ListItemSecondaryAction, ListItemText, Pagination } from "@mui/material";
import { Add } from "@mui/icons-material";
import { FormattedMessage } from "react-intl";
import { useWeb3React } from "@web3-react/core";

import { Breadcrumbs, PageHeader, ProgressOverlay } from "@gemunion/mui-page-layout";
import { useCollection } from "@gemunion/react-hooks";
import { IWaitListItem, IWaitListItemSearchDto } from "@framework/types";

import { WaitListClaimButton } from "../../../../components/buttons";
import { WaitListJoinDialog } from "../../../../components/buttons/mechanics/waitlist/join";

export const WaitListItem: FC = () => {
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
  } = useCollection<IWaitListItem, IWaitListItemSearchDto>({
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
          <FormattedMessage id="form.buttons.join" />
        </Button>
      </PageHeader>

      <ProgressOverlay isLoading={isLoading}>
        <List sx={{ overflowX: "scroll" }}>
          {rows.map((waitlist, i) => (
            <ListItem key={i} sx={{ flexWrap: "wrap" }}>
              <ListItemText sx={{ width: 0.6 }}>{waitlist.account}</ListItemText>
              <ListItemText sx={{ width: { xs: 0.6, md: 0.2 } }}>{waitlist.list?.title}</ListItemText>
              <ListItemSecondaryAction
                sx={{
                  top: { xs: "80%", sm: "50%" },
                  transform: { xs: "translateY(-80%)", sm: "translateY(-50%)" },
                }}
              >
                <WaitListClaimButton listId={waitlist.listId} />
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

      <WaitListJoinDialog
        onCancel={handleEditCancel}
        onConfirm={handleEditConfirm}
        open={isEditDialogOpen}
        initialValues={selected}
      />
    </Fragment>
  );
};
