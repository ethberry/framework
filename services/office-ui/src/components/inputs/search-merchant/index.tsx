import { FC, useEffect } from "react";
import { useWatch } from "react-hook-form";

import { useInputRegistry } from "@gemunion/mui-form";
import { EntityInput, IEntityInputProps } from "@gemunion/mui-inputs-entity";

export interface ISearchMerchantInputProps extends Partial<IEntityInputProps> {}

export const SearchMerchantInput: FC<ISearchMerchantInputProps> = props => {
  const name = "merchantId";
  const merchantId = useWatch({ name });

  const { registeredInputs, unregisterInput } = useInputRegistry();

  useEffect(() => {
    if (merchantId && registeredInputs.some(input => input.name === name)) {
      unregisterInput(name);
    }
  }, [merchantId, registeredInputs]);

  return <EntityInput name={name} controller="merchants" {...props} />;
};
