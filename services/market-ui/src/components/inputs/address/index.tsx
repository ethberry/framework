import { FC } from "react";

import { EnabledCountries } from "@gemunion/constants";
import { SelectInput, SwitchInput, TextInput } from "@gemunion/mui-inputs-core";
import { useLicense } from "@gemunion/provider-license";

import { StyledPaper } from "./styled";

export interface IAddressInputProps {
  outlined?: boolean;
  prefix?: string;
}

export const AddressInput: FC<IAddressInputProps> = props => {
  const { outlined = true, prefix = "" } = props;

  const license = useLicense();

  if (!license.isValid()) {
    return null;
  }

  const handlePrefix = (name: string): string => {
    return `${prefix ? `${prefix}.` : ""}${name}`;
  };

  return (
    <StyledPaper elevation={outlined ? 1 : 0} outlined={outlined}>
      <TextInput name={handlePrefix("addressLine1")} />
      <TextInput name={handlePrefix("addressLine2")} />
      <TextInput name={handlePrefix("city")} />
      <SelectInput name={handlePrefix("country")} options={EnabledCountries} />
      <TextInput name={handlePrefix("state")} />
      <TextInput name={handlePrefix("zip")} />
      <SwitchInput name={handlePrefix("isDefault")} />
    </StyledPaper>
  );
};
