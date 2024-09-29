import { FC, useEffect } from "react";
import { useFormContext, useWatch } from "react-hook-form";

import { EntityInput } from "@ethberry/mui-inputs-entity";

import { useFormatAddress } from "../../../utils/address";

export interface IAddressSelectInputProps {
  name?: string;
}

export const AddressSelectInput: FC<IAddressSelectInputProps> = props => {
  const { name = "addressId" } = props;

  const form = useFormContext();
  const userId = useWatch({ name: "userId" });

  const { formatAddress } = useFormatAddress();

  useEffect(() => {
    form.setValue(name, 0);
  }, [userId]);

  if (!userId) {
    return null;
  }

  return (
    <EntityInput name={name} controller="ecommerce/address" data={{ userId }} getTitle={formatAddress} autoselect />
  );
};
