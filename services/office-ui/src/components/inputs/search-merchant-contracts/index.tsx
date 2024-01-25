import { FC, useEffect } from "react";
import { useFormContext, useWatch } from "react-hook-form";

import { EntityInput, IEntityInputProps } from "@gemunion/mui-inputs-entity";

export interface ISearchMerchantContractsInputProps extends Partial<IEntityInputProps> {
  name: string;
}

export const SearchMerchantContractsInput: FC<ISearchMerchantContractsInputProps> = props => {
  const { name, data, ...rest } = props;
  const form = useFormContext();
  const merchantId = useWatch({ name: "merchantId" });

  useEffect(() => {
    form.setValue(name, [], { shouldDirty: true, shouldTouch: true });
  }, [merchantId]);

  return (
    <EntityInput
      name={name}
      controller="contracts"
      data={{
        ...data,
        merchantId,
      }}
      {...rest}
    />
  );
};
