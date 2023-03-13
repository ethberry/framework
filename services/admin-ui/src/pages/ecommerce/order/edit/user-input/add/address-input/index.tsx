import { FC, Fragment } from "react";
import { useWatch } from "react-hook-form";
import { FormattedMessage } from "react-intl";
import { Typography } from "@mui/material";

import { IAddress } from "@framework/types";
import { TextInput } from "@gemunion/mui-inputs-core";

export interface IAddressInputProps {
  name: string;
}

export const AddressInput: FC<IAddressInputProps> = props => {
  const { name } = props;

  const value = useWatch({ name });

  return (
    <Fragment>
      <br />
      <br />
      <Typography>
        <FormattedMessage id={`form.labels.${name}`} />
      </Typography>
      {value?.map((_addr: IAddress, i: number) => (
        <TextInput key={i} name={`${name}[${i}].address`} />
      ))}
    </Fragment>
  );
};
