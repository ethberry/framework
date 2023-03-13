import { FC, Fragment } from "react";
import { useWatch } from "react-hook-form";

import { TextInput } from "@gemunion/mui-inputs-core";
import { IAddress } from "@framework/types";

export interface IAddressInputProps {
  name: string;
}

export const AddressInput: FC<IAddressInputProps> = props => {
  const { name } = props;

  const value = useWatch({ name });

  return (
    <Fragment>
      {value.map((_addr: IAddress, i: number) => (
        <TextInput key={i} name={`${name}[${i}].address`} />
      ))}
    </Fragment>
  );
};
