import { FC, Fragment } from "react";
import {
  Button,
  Chip,
  IconButton,
  List,
  ListItem,
  ListItemSecondaryAction,
  ListItemText,
  Tooltip,
} from "@mui/material";
import { Add, Delete, Edit } from "@mui/icons-material";
import { FormattedMessage, useIntl } from "react-intl";

import type { IAddress } from "@framework/types";
import { AddressStatus } from "@framework/types";
import { DeleteDialog } from "@gemunion/mui-dialog-delete";
import { PageHeader, ProgressOverlay } from "@gemunion/mui-page-layout";
import { useCollection } from "@gemunion/react-hooks";

import { emptyAddress } from "../../../../components/common/interfaces";
import { useFormatAddress } from "../../../../utils/address";
import { AddressEditDialog } from "./edit";
import { ITabPanelProps } from "../tabs";

export const ProfileAddresses: FC<ITabPanelProps> = props => {
  const { open } = props;

  const {
    rows,
    selected,
    isLoading,
    isDeleteDialogOpen,
    isEditDialogOpen,
    handleCreate,
    handleDelete,
    handleDeleteCancel,
    handleDeleteConfirm,
    handleEdit,
    handleEditCancel,
    handleEditConfirm,
  } = useCollection<IAddress>({
    baseUrl: "/profile/address",
    embedded: true,
    empty: emptyAddress,
    filter: ({ addressLine1, addressLine2, city, country, isDefault, state, zip }) => ({
      addressLine1,
      addressLine2,
      city,
      country,
      isDefault,
      state,
      zip,
    }),
  });

  const { formatMessage } = useIntl();
  const { formatAddress } = useFormatAddress();

  if (!open) {
    return null;
  }

  return (
    <Fragment>
      <PageHeader message="pages.profile.tabs.addresses">
        <Button variant="outlined" startIcon={<Add />} onClick={handleCreate}>
          <FormattedMessage id="form.buttons.create" />
        </Button>
      </PageHeader>

      <ProgressOverlay isLoading={isLoading}>
        <List disablePadding={true}>
          {rows.length ? (
            rows.map((address: IAddress) => (
              <ListItem key={address.id} disableGutters={true}>
                <ListItemText
                  primary={
                    <Fragment>
                      {formatAddress(address)}
                      &nbsp;
                      {address.isDefault ? (
                        <Chip
                          size="small"
                          color="primary"
                          label={formatMessage({ id: "pages.profile.addresses.default" })}
                        />
                      ) : null}
                      {address.addressStatus === AddressStatus.INACTIVE ? (
                        <Chip
                          size="small"
                          color="secondary"
                          label={formatMessage({ id: "pages.profile.addresses.inactive" })}
                        />
                      ) : null}
                    </Fragment>
                  }
                  sx={{ pr: 3 }}
                />
                <ListItemSecondaryAction>
                  <Tooltip title={formatMessage({ id: "form.tips.edit" })}>
                    <IconButton edge="end" aria-label="edit" onClick={handleEdit(address)} sx={{ mr: 0.5 }}>
                      <Edit />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title={formatMessage({ id: "form.tips.delete" })}>
                    <IconButton edge="end" aria-label="delete" onClick={handleDelete(address)}>
                      <Delete />
                    </IconButton>
                  </Tooltip>
                </ListItemSecondaryAction>
              </ListItem>
            ))
          ) : (
            <ListItem disableGutters={true}>
              <FormattedMessage id="pages.profile.addresses.empty" />
            </ListItem>
          )}
        </List>
      </ProgressOverlay>

      <AddressEditDialog
        onCancel={handleEditCancel}
        onConfirm={handleEditConfirm}
        open={isEditDialogOpen}
        initialValues={selected}
      />

      <DeleteDialog
        onCancel={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        open={isDeleteDialogOpen}
        initialValues={selected}
        getTitle={formatAddress}
      />
    </Fragment>
  );
};
