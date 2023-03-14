import { FC, Fragment, useContext, useEffect, useState } from "react";
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
import { Add, Delete } from "@mui/icons-material";
import { FormattedMessage, useIntl } from "react-intl";
import { useSnackbar } from "notistack";

import { AddressStatus, IAddress } from "@framework/types";
import { DeleteDialog } from "@gemunion/mui-dialog-delete";
import { PageHeader, ProgressOverlay } from "@gemunion/mui-page-layout";
import { ApiContext, ApiError } from "@gemunion/provider-api-firebase";
import { IPaginationResult } from "@gemunion/types-collection";

import { ITabPanelProps, ProfileTabs } from "../tabs";
import { AddAddressDialog } from "./add";

const emptyAddr = {
  isDefault: false,
  address: "",
} as IAddress;

export const ProfileAddresses: FC<ITabPanelProps> = props => {
  const { value } = props;

  const { formatMessage } = useIntl();
  const { enqueueSnackbar } = useSnackbar();

  const [isLoading, setIsLoading] = useState(false);
  const [addresses, setAddresses] = useState<Array<IAddress>>([]);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [selectedAddr, setSelectedAddr] = useState<IAddress>(emptyAddr);

  const api = useContext(ApiContext);

  const fetchAddresses = async (): Promise<void> => {
    setIsLoading(true);
    return api
      .fetchJson({
        url: "/address",
      })
      .then((json: IPaginationResult<IAddress>) => {
        setAddresses(json.rows);
      })
      .catch((e: ApiError) => {
        if (e.status) {
          enqueueSnackbar(formatMessage({ id: `snackbar.${e.message}` }), { variant: "error" });
        } else {
          console.error(e);
          enqueueSnackbar(formatMessage({ id: "snackbar.error" }), { variant: "error" });
        }
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const handleDelete =
    (addr: IAddress): (() => void) =>
    (): void => {
      setSelectedAddr(addr);
      setIsDeleteDialogOpen(true);
    };

  const handleDeleteCancel = (): void => {
    setIsDeleteDialogOpen(false);
  };

  const handleDeleteConfirmed = (addr: IAddress): Promise<void> => {
    return api
      .fetchJson({
        url: `/address/${addr.id}`,
        method: "DELETE",
      })
      .then(() => {
        enqueueSnackbar(formatMessage({ id: "snackbar.deleted" }), { variant: "success" });
        return fetchAddresses();
      })
      .catch((e: ApiError) => {
        if (e.status) {
          enqueueSnackbar(formatMessage({ id: `snackbar.${e.message}` }), { variant: "error" });
        } else {
          console.error(e);
          enqueueSnackbar(formatMessage({ id: "snackbar.error" }), { variant: "error" });
        }
      })
      .finally(() => {
        setIsDeleteDialogOpen(false);
      });
  };

  const handleAdd = () => {
    setSelectedAddr(emptyAddr);
    setIsAddDialogOpen(true);
  };

  const handleAddCancel = (): void => {
    setIsAddDialogOpen(false);
  };

  const handleAddConfirmed = (values: Partial<IAddress>, form: any): Promise<void> => {
    return api
      .fetchJson({
        url: "/address",
        method: "POST",
        data: values,
      })
      .then(() => {
        enqueueSnackbar(formatMessage({ id: "snackbar.created" }), { variant: "success" });
        setIsAddDialogOpen(false);
        return fetchAddresses();
      })
      .catch((e: ApiError) => {
        if (e.status === 400) {
          const errors = e.getLocalizedValidationErrors();

          Object.keys(errors).forEach(key => {
            form?.setError(name, { type: "custom", message: errors[key] });
          });
        } else if (e.status) {
          enqueueSnackbar(formatMessage({ id: `snackbar.${e.message}` }), { variant: "error" });
        } else {
          console.error(e);
          enqueueSnackbar(formatMessage({ id: "snackbar.error" }), { variant: "error" });
        }
      });
  };

  useEffect(() => {
    void fetchAddresses();
  }, []);

  if (value !== ProfileTabs.addresses) {
    return null;
  }

  return (
    <Fragment>
      <PageHeader message="pages.profile.tabs.addresses">
        <Button variant="outlined" startIcon={<Add />} onClick={handleAdd}>
          <FormattedMessage id="form.buttons.add" />
        </Button>
      </PageHeader>

      <ProgressOverlay isLoading={isLoading}>
        <List disablePadding={true}>
          {addresses.length ? (
            addresses.map((addr: IAddress, i: number) => (
              <ListItem key={i} disableGutters={true}>
                <ListItemText
                  primary={
                    <Fragment>
                      {addr.address}
                      &nbsp;
                      {addr.isDefault ? (
                        <Chip
                          size="small"
                          color="primary"
                          label={formatMessage({ id: "pages.profile.addresses.default" })}
                        />
                      ) : null}
                      {addr.addressStatus === AddressStatus.INACTIVE ? (
                        <Chip
                          size="small"
                          color="secondary"
                          label={formatMessage({ id: "pages.profile.addresses.inactive" })}
                        />
                      ) : null}
                    </Fragment>
                  }
                />
                <ListItemSecondaryAction>
                  <Tooltip title={formatMessage({ id: "form.tips.delete" })}>
                    <IconButton edge="end" aria-label="delete" onClick={handleDelete(addr)}>
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

      <AddAddressDialog
        onCancel={handleAddCancel}
        onConfirm={handleAddConfirmed}
        open={isAddDialogOpen}
        initialValues={selectedAddr}
      />

      <DeleteDialog
        onCancel={handleDeleteCancel}
        onConfirm={handleDeleteConfirmed}
        open={isDeleteDialogOpen}
        initialValues={selectedAddr}
        getTitle={(address: IAddress) => address.address}
      />
    </Fragment>
  );
};
