import { ChangeEvent, FC } from "react";
import { useFormContext } from "react-hook-form";

import { EntityInput } from "@gemunion/mui-inputs-entity";
import { ContractFeatures, ContractStatus, ModuleType, TokenType } from "@framework/types";

export interface IContractInputProps {
  name: string;
  controller?: string;
  related?: string;
  data?: {
    contractType?: Array<TokenType>;
    contractStatus?: Array<ContractStatus>;
    contractModule?: Array<ModuleType>;
    contractFeatures?: Array<ContractFeatures>;
    includeExternalContracts?: boolean;
    excludeFeatures?: Array<ContractFeatures>;
  };
}

export const ContractInput: FC<IContractInputProps> = props => {
  const { name, controller = "contracts", related = "address", data = {} } = props;

  const form = useFormContext<any>();

  const handleChange = (_event: ChangeEvent<unknown>, option: any): void => {
    form.setValue(name, option?.id ?? 0, { shouldDirty: true });
    form.setValue(`contract.${related}`, option?.address ?? "0x");
    form.setValue("contract.decimals", option?.decimals ?? 0);
    form.setValue("contract.moduleType", option?.moduleType ?? 0);
    form.setValue("contract.contractType", option?.contractType ?? 0);
    form.setValue("contract.contractFeatures", option?.contractFeatures ?? 0);
  };

  return <EntityInput name={name} controller={controller} data={data} onChange={handleChange} autoselect />;
};
