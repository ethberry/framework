import { ChangeEvent, FC, useEffect, useState } from "react";
import { useFormContext, useWatch } from "react-hook-form";
import { FormattedMessage } from "react-intl";
import {
  Button,
  Grid,
  List,
  ListItem,
  ListItemSecondaryAction,
  ListItemText,
  Paper,
  Radio,
  Typography,
} from "@mui/material";
import { Add } from "@mui/icons-material";

import { IAddress } from "@framework/types";
import { ProgressOverlay } from "@gemunion/mui-page-layout";
import { useApiCall } from "@gemunion/react-hooks";
import { IPaginationResult } from "@gemunion/types-collection";

import { emptyAddress } from "../../../../../components/common/interfaces";
import { AddressEditDialog } from "../../../../infrastructure/profile/adresses/edit";
import { useFormatAddress } from "../../../../../utils/address";
import { useStyles } from "./styles";

interface IAddressInputProps {
  name?: string;
}

export const AddressInput: FC<IAddressInputProps> = props => {
  const { name = "addressId" } = props;

  const form = useFormContext<any>();
  const value = useWatch({ name });

  const { formatAddress } = useFormatAddress();

  const classes = useStyles();

  const [addresses, setAddresses] = useState<Array<IAddress>>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [selectedAddr, setSelectedAddr] = useState<IAddress>(emptyAddress);

  const handleAdd = () => {
    setSelectedAddr(emptyAddress);
    setIsAddDialogOpen(true);
  };

  const handleAddCancel = (): void => {
    setIsAddDialogOpen(false);
  };

  const { fn: fetchAddressesApi, isLoading } = useApiCall(
    api =>
      api
        .fetchJson({
          url: "/address",
        })
        .then((json: IPaginationResult<IAddress>) => {
          setAddresses(json.rows);
        }),
    { success: false },
  );

  const fetchAddresses = (): Promise<void> => {
    return fetchAddressesApi(undefined);
  };

  const { fn: handleAddConfirmedApi } = useApiCall((api, values: Partial<IAddress>) =>
    api
      .fetchJson({
        url: "/address",
        method: "POST",
        data: values,
      })
      .then(() => {
        setIsAddDialogOpen(false);
        return fetchAddresses();
      }),
  );

  const handleAddConfirmed = (values: Partial<IAddress>, form: any): Promise<void> => {
    return handleAddConfirmedApi(form, values);
  };

  useEffect(() => {
    void fetchAddresses();
  }, []);

  useEffect(() => {
    const addressId = addresses?.length ? addresses.find(addr => addr.isDefault)?.id : null;
    form.reset({
      [name]: addressId,
    });
  }, [addresses]);

  return (
    <Paper className={classes.paper}>
      <Grid container justifyContent="space-between" alignItems="center">
        <Typography component="h4" variant="h5">
          <FormattedMessage id="pages.checkout.address" />
        </Typography>
        <Button variant="outlined" startIcon={<Add />} onClick={handleAdd}>
          <FormattedMessage id="form.buttons.create" />
        </Button>
      </Grid>

      <ProgressOverlay isLoading={isLoading}>
        <List disablePadding={true}>
          {addresses.length ? (
            addresses.map((address: IAddress) => (
              <ListItem key={address.id} disableGutters={true}>
                <ListItemText>
                  <Typography component="pre">
                    <Typography component="pre">{formatAddress(address)}</Typography>
                  </Typography>
                </ListItemText>
                <ListItemSecondaryAction>
                  <Radio
                    name={name}
                    checked={value === address.id}
                    value={address.id}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => {
                      form.setValue(name, ~~e.target.value, { shouldDirty: true });
                    }}
                  />
                </ListItemSecondaryAction>
              </ListItem>
            ))
          ) : (
            <ListItem disableGutters={true}>
              <FormattedMessage id="pages.checkout.addresses.empty" />
            </ListItem>
          )}
        </List>
      </ProgressOverlay>

      <AddressEditDialog
        onCancel={handleAddCancel}
        onConfirm={handleAddConfirmed}
        open={isAddDialogOpen}
        initialValues={selectedAddr}
      />
    </Paper>
  );
};
