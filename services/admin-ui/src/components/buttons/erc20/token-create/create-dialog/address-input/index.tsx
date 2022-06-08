import { FC, useEffect } from "react";
import { useFormContext, useWatch } from "react-hook-form";
import { constants } from "ethers";

import { TextInput } from "@gemunion/mui-inputs-core";
import { Erc20TokenTemplate } from "@framework/types";

export interface IAddressInputProps {
  name?: string;
}

export const AddressInput: FC<IAddressInputProps> = props => {
  const { name = "address" } = props;

  const form = useFormContext<any>();

  const contractTemplate = useWatch({ name: "contractTemplate" });

  useEffect(() => {
    if (contractTemplate === Erc20TokenTemplate.NATIVE) {
      form.setValue(name, constants.AddressZero);
    }
  }, [contractTemplate]);

  return <TextInput name={name} readOnly={contractTemplate === Erc20TokenTemplate.NATIVE} />;
};
