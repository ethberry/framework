import { FC, Fragment } from "react";
import { List, ListItem, ListItemText } from "@mui/material";
import { Delete } from "@mui/icons-material";
import { FormattedMessage } from "react-intl";

import { DeleteDialog } from "@gemunion/mui-dialog-delete";
import { PageHeader, ProgressOverlay } from "@gemunion/mui-page-layout";
import { useCollection } from "@gemunion/react-hooks";
import { useUser } from "@gemunion/provider-user";
import { ListAction, ListActions } from "@framework/mui-lists";
import type { IUser } from "@framework/types";

import { ITabPanelProps } from "../tabs";

export const MerchantManagers: FC<ITabPanelProps> = props => {
  const { open } = props;

  const { rows, selected, isLoading, isDeleteDialogOpen, handleDelete, handleDeleteCancel, handleDeleteConfirm } =
    useCollection<IUser>({
      baseUrl: "/merchant/managers",
    });

  const { profile } = useUser<IUser>();

  if (!open) {
    return null;
  }

  return (
    <Fragment>
      <PageHeader message="pages.merchant.tabs.managers" />

      <ProgressOverlay isLoading={isLoading}>
        <List disablePadding={true}>
          {rows.length ? (
            rows.map((user: IUser) => (
              <ListItem key={user.id} disableGutters={true}>
                <ListItemText>{user.displayName}</ListItemText>
                <ListActions>
                  <ListAction
                    icon={Delete}
                    message="form.tips.delete"
                    onClick={handleDelete(user)}
                    disabled={user.id === profile.id}
                  />
                </ListActions>
              </ListItem>
            ))
          ) : (
            <ListItem disableGutters={true}>
              <FormattedMessage id="pages.merchant.managers.empty" />
            </ListItem>
          )}
        </List>
      </ProgressOverlay>

      <DeleteDialog
        onCancel={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        open={isDeleteDialogOpen}
        initialValues={selected}
        getTitle={(user: IUser) => user.displayName}
      />
    </Fragment>
  );
};
