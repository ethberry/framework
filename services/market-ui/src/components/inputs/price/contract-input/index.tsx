import { ChangeEvent, FC } from "react";
import { useFormContext, useWatch } from "react-hook-form";

import { EntityInput } from "@gemunion/mui-inputs-entity";
import { ModuleType } from "@framework/types";

export interface IContractInputProps {
  prefix: string;
  name?: string;
  readOnly?: boolean;
  contractModule?: Array<ModuleType>;
}

export const ContractInput: FC<IContractInputProps> = props => {
  const { prefix, name = "contractId", contractModule = [], readOnly } = props;

  const tokenType = useWatch({ name: `${prefix}.tokenType` });
  const form = useFormContext<any>();

  const handleChange = (_event: ChangeEvent<unknown>, option: any | null): void => {
    form.setValue(`${prefix}.${name}`, option?.id ?? 0);
    form.setValue(`${prefix}.contract.address`, option?.address ?? "0x");
    form.setValue(`${prefix}.contract.decimals`, option?.decimals ?? 0);
  };

  return (
    <EntityInput
      name={`${prefix}.${name}`}
      controller="contracts"
      data={{
        contractType: [tokenType],
        contractModule,
      }}
      onChange={handleChange}
      readOnly={readOnly}
    />
  );
};
