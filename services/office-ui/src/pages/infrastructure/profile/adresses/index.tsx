import { FC, Fragment } from "react";
import { Button, Chip, ListItemText } from "@mui/material";
import { Add, Delete, Create } from "@mui/icons-material";
import { FormattedMessage, useIntl } from "react-intl";

import { ListAction, ListActions, StyledListItem, StyledListWrapper } from "@framework/styled";
import type { IAddress } from "@framework/types";
import { AddressStatus } from "@framework/types";
import { DeleteDialog } from "@gemunion/mui-dialog-delete";
import { PageHeader, ProgressOverlay } from "@gemunion/mui-page-layout";
import { useCollection, CollectionActions } from "@gemunion/react-hooks";

import { useFormatAddress } from "../../../../utils/address";
import { emptyAddress } from "../../../../components/common/interfaces";
import type { ITabPanelProps } from "../tabs";
import { AddressEditDialog } from "./edit";

export const ProfileAddresses: FC<ITabPanelProps> = props => {
  const { open } = props;

  const {
    rows,
    action,
    selected,
    isLoading,
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
        <Button
          variant="outlined"
          startIcon={<Add />}
          onClick={handleCreate}
          data-testid="EcommerceAddressCreateButton"
        >
          <FormattedMessage id="form.buttons.create" />
        </Button>
      </PageHeader>

      <ProgressOverlay isLoading={isLoading}>
        <StyledListWrapper count={rows.length} isLoading={isLoading} message="pages.profile.addresses.empty">
          {rows.map((address: IAddress) => (
            <StyledListItem key={address.id}>
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
              <ListActions>
                <ListAction
                  onClick={handleEdit(address)}
                  message="form.buttons.edit"
                  dataTestId="AddressEditButton"
                  icon={Create}
                />
                <ListAction
                  onClick={handleDelete(address)}
                  message="form.buttons.delete"
                  dataTestId="AddressDeleteButton"
                  icon={Delete}
                />
              </ListActions>
            </StyledListItem>
          ))}
        </StyledListWrapper>
      </ProgressOverlay>

      <AddressEditDialog
        onCancel={handleEditCancel}
        onConfirm={handleEditConfirm}
        open={action === CollectionActions.edit}
        initialValues={selected}
      />

      <DeleteDialog
        onCancel={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        open={action === CollectionActions.delete}
        initialValues={selected}
        getTitle={formatAddress}
      />
    </Fragment>
  );
};
