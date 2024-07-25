import { FC, Fragment } from "react";
import { Box, Button, Chip, ListItemText } from "@mui/material";
import { Add, Delete, Create } from "@mui/icons-material";
import { FormattedMessage, useIntl } from "react-intl";

import { ListAction, ListActions, StyledListItem, StyledListWrapper } from "@framework/styled";
import type { IAddress } from "@framework/types";
import { AddressStatus } from "@framework/types";
import { DeleteDialog } from "@gemunion/mui-dialog-delete";
import { ProgressOverlay } from "@gemunion/mui-page-layout";
import { useCollection, CollectionActions } from "@gemunion/provider-collection";
import type { IPaginationDto } from "@gemunion/types-collection";

import { emptyAddress } from "../../../../../components/common/interfaces";
import { useFormatAddress } from "../../../../../utils/address";
import { UserAddressForm } from "./edit";

export interface IUserAddressSearchDro extends IPaginationDto {
  userId: number;
}

export interface IUserAddressesProps {
  open: boolean;
  userId: number;
}

export const UserAddresses: FC<IUserAddressesProps> = props => {
  const { userId, open } = props;

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
  } = useCollection<IAddress, IUserAddressSearchDro>({
    baseUrl: "/address",
    embedded: true,
    empty: { ...emptyAddress, userId },
    search: { userId },
    filter: ({ addressLine1, addressLine2, city, country, isDefault, state, userId, zip }) => ({
      addressLine1,
      addressLine2,
      city,
      country,
      isDefault,
      state,
      userId,
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
      <Box sx={{ position: "absolute", top: 0, right: 0 }}>
        <Button
          variant="outlined"
          startIcon={<Add />}
          onClick={handleCreate}
          data-testid="EcommerceAddressCreateButton"
        >
          <FormattedMessage id="form.buttons.create" />
        </Button>
      </Box>

      <ProgressOverlay isLoading={isLoading}>
        <StyledListWrapper count={rows.length} isLoading={isLoading} message="pages.profile.addresses.empty">
          {rows.map((address: IAddress, i: number) => (
            <StyledListItem key={address.id || i}>
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
                sx={{ pr: 7 }}
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

      <UserAddressForm
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
