import { FC } from "react";
import { Paper } from "@mui/material";

import { EnabledCountries } from "@gemunion/constants";
import { SelectInput, SwitchInput, TextInput } from "@gemunion/mui-inputs-core";
import { useLicense } from "@gemunion/provider-license";

export interface IAddressInputProps {
  outlined?: boolean;
}

export const AddressInput: FC<IAddressInputProps> = props => {
  const { outlined = true } = props;

  const license = useLicense();

  if (!license.isValid()) {
    return null;
  }

  return (
    <Paper elevation={outlined ? 1 : 0} sx={{ px: outlined ? 2 : 0 }}>
      <TextInput name="addressLine1" />
      <TextInput name="addressLine2" />
      <TextInput name="city" />
      <SelectInput name="country" options={EnabledCountries} />
      <TextInput name="state" />
      <TextInput name="zip" />
      <SwitchInput name="isDefault" />
    </Paper>
  );
};
