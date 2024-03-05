import { ChangeEvent, FC } from "react";
import { useFormContext } from "react-hook-form";

import { EntityInput } from "@gemunion/mui-inputs-entity";
import { ContractFeatures, ContractStatus, ModuleType, TokenType } from "@framework/types";

export interface IContractInputProps {
  name: string;
  controller?: string;
  data?: {
    contractType?: Array<TokenType>;
    contractStatus?: Array<ContractStatus>;
    contractModule?: Array<ModuleType>;
    contractFeatures?: Array<ContractFeatures>;
  };
}

export const AllowanceContractInput: FC<IContractInputProps> = props => {
  const { name, controller = "contracts", data = {} } = props;

  const form = useFormContext<any>();

  const handleChange = (_event: ChangeEvent<unknown>, option: any): void => {
    form.setValue(name, option?.id ?? 0, { shouldDirty: true });
    form.setValue(`contract.address`, option?.address ?? "0x");
    void form.trigger();
  };

  return (
    <EntityInput
      name={name}
      controller={controller}
      data={{ contractFeatures: [ContractFeatures.ALLOWANCE], ...data }}
      onChange={handleChange}
      autoselect
    />
  );
};
