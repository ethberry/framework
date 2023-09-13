import { FC, Fragment } from "react";
import { useWatch } from "react-hook-form";

import { IAddress } from "@framework/types";

import { AddressInput } from "../../../../../components/inputs/address";

export interface IAddressInputProps {
  name: string;
}

export const AddressesInput: FC<IAddressInputProps> = props => {
  const { name } = props;

  const value = useWatch({ name });

  return (
    <Fragment>
      {value.map((addr: IAddress, i: number) => (
        <AddressInput key={addr.id} prefix={`${name}[${i}]`} />
      ))}
    </Fragment>
  );
};
