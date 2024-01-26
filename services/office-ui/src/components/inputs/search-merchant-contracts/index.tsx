import { FC, useEffect } from "react";
import { useFormContext, useWatch } from "react-hook-form";

import { EntityInput, IEntityInputProps } from "@gemunion/mui-inputs-entity";

export interface ISearchMerchantContractsInputProps extends Partial<IEntityInputProps> {
  name: string;
  withTokenType?: boolean;
}

export const SearchMerchantContractsInput: FC<ISearchMerchantContractsInputProps> = props => {
  const { name, data, withTokenType = false, ...rest } = props;

  const form = useFormContext();
  const merchantId = useWatch({ name: "merchantId" });
  const tokenType = useWatch({ name: "tokenType" });

  useEffect(() => {
    form.setValue(name, [], { shouldDirty: true, shouldTouch: true });
  }, [merchantId]);

  return (
    <EntityInput
      name={name}
      controller="contracts"
      data={{
        ...data,
        ...(withTokenType ? { contractType: [tokenType] } : {}),
        merchantId,
      }}
      {...rest}
    />
  );
};
