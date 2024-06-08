import { FC, Fragment } from "react";
import { ListItemText } from "@mui/material";
import { Delete } from "@mui/icons-material";

import { DeleteDialog } from "@gemunion/mui-dialog-delete";
import { PageHeader, ProgressOverlay } from "@gemunion/mui-page-layout";
import { useCollection, CollectionActions } from "@gemunion/react-hooks";
import { ListAction, ListActions, StyledListItem, StyledListWrapper } from "@framework/styled";
import type { IOtp } from "@framework/types";

import { ITabPanelProps } from "../tabs";

export const MerchantInvitations: FC<ITabPanelProps> = props => {
  const { open } = props;

  const { rows, action, selected, isLoading, handleDelete, handleDeleteCancel, handleDeleteConfirm } =
    // @ts-ignore
    useCollection<IOtp>({
      empty: {
        uuid: "1",
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
        <StyledListWrapper count={rows.length} isLoading={isLoading} message="pages.merchant.invitations.empty">
          {rows.map(otp => (
            <StyledListItem key={otp.uuid}>
              <ListItemText>{otp.user?.displayName}</ListItemText>
              <ListActions>
                <ListAction message="form.tips.delete" icon={Delete} onClick={handleDelete(otp)} />
              </ListActions>
            </StyledListItem>
          ))}
        </StyledListWrapper>
      </ProgressOverlay>

      <DeleteDialog
        onCancel={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        open={action === CollectionActions.delete}
        initialValues={{ id: selected.uuid, ...selected }}
        getTitle={(otp: IOtp) => otp.user?.displayName || ""}
      />
    </Fragment>
  );
};
