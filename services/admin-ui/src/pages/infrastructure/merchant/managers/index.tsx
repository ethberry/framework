import { FC, Fragment } from "react";
import { ListItemText } from "@mui/material";
import { Delete } from "@mui/icons-material";

import { DeleteDialog } from "@gemunion/mui-dialog-delete";
import { PageHeader, ProgressOverlay } from "@gemunion/mui-page-layout";
import { useCollection, CollectionActions } from "@gemunion/react-hooks";
import { useUser } from "@gemunion/provider-user";
import { ListAction, ListActions, StyledListItem, StyledListWrapper } from "@framework/styled";
import type { IUser } from "@framework/types";

import { ITabPanelProps } from "../tabs";
import { InviteButton } from "./invite";

export const MerchantManagers: FC<ITabPanelProps> = props => {
  const { open } = props;

  const { rows, action, selected, isLoading, handleDelete, handleDeleteCancel, handleDeleteConfirm } =
    useCollection<IUser>({
      baseUrl: "/merchant/managers",
    });

  const { profile } = useUser<IUser>();

  if (!open) {
    return null;
  }

  return (
    <Fragment>
      <PageHeader message="pages.merchant.tabs.managers">
        <InviteButton />
      </PageHeader>

      <ProgressOverlay isLoading={isLoading}>
        <StyledListWrapper count={rows.length} isLoading={isLoading} message="pages.merchant.managers.empty">
          {rows.map(user => (
            <StyledListItem key={user.id}>
              <ListItemText>{user.displayName}</ListItemText>
              <ListActions>
                <ListAction
                  icon={Delete}
                  message="form.tips.delete"
                  onClick={handleDelete(user)}
                  disabled={user.id === profile.id}
                />
              </ListActions>
            </StyledListItem>
          ))}
        </StyledListWrapper>
      </ProgressOverlay>

      <DeleteDialog
        onCancel={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        open={action === CollectionActions.delete}
        initialValues={selected}
        getTitle={(user: IUser) => user.displayName}
      />
    </Fragment>
  );
};
