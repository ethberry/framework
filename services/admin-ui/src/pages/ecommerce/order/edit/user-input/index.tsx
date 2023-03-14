import { ChangeEvent, FC, Fragment, ReactElement, useContext, useEffect, useState } from "react";
import { useSnackbar } from "notistack";
import { FormattedMessage, useIntl } from "react-intl";
import { get, useFormContext, useWatch } from "react-hook-form";
import {
  Autocomplete,
  AutocompleteRenderInputParams,
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  TextField,
} from "@mui/material";
import { Add } from "@mui/icons-material";

import { Spinner } from "@gemunion/mui-page-layout";
import { ApiContext, ApiError } from "@gemunion/provider-api-firebase";
import { IAddress, IUser, UserRole } from "@framework/types";

import { AddUserDialog } from "./add";
import { useStyles } from "./styles";
import { emptyUser } from "../../../../../components/common/interfaces";

export interface IUserInputProps {
  name: "userId";
}

export const UserInput: FC<IUserInputProps> = props => {
  const { name = "userId" } = props;

  const classes = useStyles();

  const form = useFormContext();
  const errors = form.formState.errors;
  const value = useWatch({ name });
  const values = useWatch();

  const [isLoading, setIsLoading] = useState(true);
  const [users, setUsers] = useState<Array<IUser>>([]);
  const [addresses, setAddresses] = useState<Array<IAddress>>([]);
  const { enqueueSnackbar } = useSnackbar();
  const { formatMessage } = useIntl();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  const api = useContext(ApiContext);

  const fetchUsers = async (): Promise<void> => {
    // setIsLoading(true);
    return api
      .fetchJson({
        url: "/users/autocomplete",
        data: {
          userRoles: [UserRole.CUSTOMER],
        },
      })
      .then((json: Array<IUser>) => {
        setUsers(json);
        const user = json.find(user => user.id === get(values, "userId"));
        if (user) {
          setAddresses(user.addresses);
        }
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

  const handleClick = () => {
    setIsAddDialogOpen(true);
  };

  const handleAddConfirmed = (values: Partial<IUser>, form: any): Promise<void> => {
    return api
      .fetchJson({
        url: "/users/quick",
        method: "POST",
        data: values,
      })
      .then(json => {
        enqueueSnackbar(formatMessage({ id: "snackbar.created" }), { variant: "success" });
        setIsAddDialogOpen(false);
        return fetchUsers().then(() => {
          form.setValue(name, json.id, { shouldDirty: true });
          form.setValue("addressId", json.address[0].id, { shouldDirty: true });
        });
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

  const handleAddCancel = (): void => {
    setIsAddDialogOpen(false);
  };

  const handleAutocompleteChange = (_event: ChangeEvent<unknown>, value: IUser | null): void => {
    if (!value) {
      setAddresses([]);
      form.setValue(name, null, { shouldDirty: true });
      form.setValue("addressId", null, { shouldDirty: true });
    } else {
      setAddresses(value.addresses);
      form.setValue(name, value.id, { shouldDirty: true });
      const defaultAddress = value.addresses.find(addr => addr.isDefault);
      if (defaultAddress) {
        form.setValue("addressId", defaultAddress.id, { shouldDirty: true });
      }
    }
  };

  const handleSelectChange = (e: SelectChangeEvent): void => {
    form.setValue("addressId", e.target.value, { shouldDirty: true });
  };

  useEffect(() => {
    void fetchUsers();
  }, []);

  const error = !!get(errors, name);

  const localizedLabel = formatMessage({ id: `form.labels.${name}` });
  const localizedPlaceholder = formatMessage({ id: `form.placeholders.${name}` });
  const localizedHelperText = error
    ? formatMessage({ id: get(errors, name) as string }, { label: localizedLabel })
    : "";

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <Fragment>
      <Grid container>
        <Grid container item xs={12}>
          <Grid item className={classes.root}>
            <Autocomplete
              multiple={false}
              options={users}
              value={users.find((option: IUser) => value === option.id) || null}
              onChange={handleAutocompleteChange}
              getOptionLabel={(option: IUser): string => option.displayName}
              renderInput={(params: AutocompleteRenderInputParams): ReactElement => (
                <TextField
                  {...params}
                  label={localizedLabel}
                  placeholder={localizedPlaceholder}
                  error={error}
                  helperText={localizedHelperText}
                  fullWidth
                />
              )}
            />
          </Grid>
          <Grid item>
            <IconButton aria-label="add" onClick={handleClick}>
              <Add />
            </IconButton>
          </Grid>
        </Grid>
        <Grid item xs={12}>
          <FormControl fullWidth>
            <InputLabel id="address-select-label">
              <FormattedMessage id="form.labels.addressId" />
            </InputLabel>
            <Select
              multiple={false}
              fullWidth
              labelId="address-select-label"
              onChange={handleSelectChange}
              value={get(values, "addressId").toString()}
              renderValue={(value): string => {
                const addr = addresses.find(addr => addr.id.toString() === value);
                return addr ? addr.address : "";
              }}
            >
              {addresses.map(addr => (
                <MenuItem value={addr.id} key={addr.id}>
                  {addr.address}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
      </Grid>

      <AddUserDialog
        onCancel={handleAddCancel}
        onConfirm={handleAddConfirmed}
        open={isAddDialogOpen}
        initialValues={emptyUser}
      />
    </Fragment>
  );
};
