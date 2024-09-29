import { FC, useEffect } from "react";
import { useFormContext, useWatch } from "react-hook-form";

import { EntityInput } from "@ethberry/mui-inputs-entity";
import { ContractFeatures, ContractStatus, ModuleType, TokenType } from "@framework/types";

interface IContractInputProps {
  name: string;
  multiple?: boolean;
  readOnly?: boolean;
  required?: boolean;
  data?: {
    contractType?: Array<TokenType>;
    contractStatus?: Array<ContractStatus>;
    contractModule?: Array<ModuleType>;
    contractFeatures?: Array<ContractFeatures>;
  };
}

export const ContractInput: FC<IContractInputProps> = props => {
  const { name, data = {}, required, multiple, readOnly } = props;

  const form = useFormContext();
  const merchantId = useWatch({ name: "merchantId" });

  useEffect(() => {
    form.setValue(name, [], { shouldDirty: true, shouldTouch: true });
  }, [merchantId]);

  return (
    <EntityInput
      required={required}
      name={name}
      controller="contracts"
      multiple={multiple}
      readOnly={readOnly}
      data={{ ...data, merchantId }}
    />
  );
};
