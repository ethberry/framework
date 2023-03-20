import { ChangeEvent, FC, useContext, useEffect, useState } from "react";
import { useFormContext, useWatch } from "react-hook-form";
import { FormattedMessage, useIntl } from "react-intl";
import { useSnackbar } from "notistack";
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

import { ProgressOverlay } from "@gemunion/mui-page-layout";
import { IPaginationResult } from "@gemunion/types-collection";
import { ApiContext, ApiError } from "@gemunion/provider-api-firebase";
import { IAddress } from "@framework/types";

import { AddressEditDialog } from "../../../../infrastructure/profile/adresses/edit";
import { useStyles } from "./styles";
import { emptyAddress } from "../../../../../components/common/interfaces";
import { useFormatAddress } from "../../../../../utils/address";

interface IAddressInputProps {
  name?: string;
}

export const AddressInput: FC<IAddressInputProps> = props => {
  const { name = "addressId" } = props;

  const form = useFormContext<any>();
  const value = useWatch({ name });

  const { formatMessage } = useIntl();
  const { enqueueSnackbar } = useSnackbar();
  const { formatAddress } = useFormatAddress();
  const classes = useStyles();

  const api = useContext(ApiContext);

  const [isLoading, setIsLoading] = useState(false);
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
          <FormattedMessage id="form.buttons.add" />
        </Button>
      </Grid>

      <ProgressOverlay isLoading={isLoading}>
        <List disablePadding={true}>
          {addresses.length ? (
            addresses.map((addr: IAddress, i: number) => (
              <ListItem key={i} disableGutters={true}>
                <ListItemText>
                  <Typography component="pre">
                    {formatAddress(addr)} {addr.id}
                  </Typography>
                </ListItemText>
                <ListItemSecondaryAction>
                  <Radio
                    name={name}
                    checked={value === addr.id}
                    value={addr.id}
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
