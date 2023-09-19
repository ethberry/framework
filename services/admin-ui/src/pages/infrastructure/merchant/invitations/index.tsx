import { FC, Fragment } from "react";
import { List, ListItem, ListItemText } from "@mui/material";
import { Delete } from "@mui/icons-material";
import { FormattedMessage } from "react-intl";

import { DeleteDialog } from "@gemunion/mui-dialog-delete";
import { PageHeader, ProgressOverlay } from "@gemunion/mui-page-layout";
import { useCollection } from "@gemunion/react-hooks";
import { ListAction, ListActions } from "@framework/mui-lists";
import type { IOtp } from "@framework/types";

import { ITabPanelProps } from "../tabs";

export const MerchantInvitations: FC<ITabPanelProps> = props => {
  const { open } = props;

  const { rows, selected, isLoading, isDeleteDialogOpen, handleDelete, handleDeleteCancel, handleDeleteConfirm } =
    // @ts-ignore
    useCollection<IOtp>({
      empty: {
        user: {
          displayName: "",
        },
      },
      baseUrl: "/invitations",
      redirect: () => "",
    });

  if (!open) {
    return null;
  }

  return (
    <Fragment>
      <PageHeader message="pages.merchant.tabs.invitations" />

      <ProgressOverlay isLoading={isLoading}>
        <List disablePadding={true}>
          {rows.length ? (
            rows.map((otp: IOtp) => (
              <ListItem key={otp.uuid} disableGutters={true}>
                <ListItemText>{otp.user!.displayName}</ListItemText>
                <ListActions>
                  <ListAction icon={Delete} message="form.tips.delete" onClick={handleDelete(otp)} />
                </ListActions>
              </ListItem>
            ))
          ) : (
            <ListItem disableGutters={true}>
              <FormattedMessage id="pages.merchant.invitations.empty" />
            </ListItem>
          )}
        </List>
      </ProgressOverlay>

      <DeleteDialog
        onCancel={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        open={isDeleteDialogOpen}
        initialValues={{ id: selected.uuid, ...selected }}
        getTitle={(otp: IOtp) => otp.user!.displayName}
      />
    </Fragment>
  );
};
