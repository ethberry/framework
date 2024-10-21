import { ChangeEvent, FC } from "react";
import { useFormContext } from "react-hook-form";

import { EntityInput } from "@ethberry/mui-inputs-entity";
import { ContractFeatures, ContractStatus, ModuleType, TokenType } from "@framework/types";

export interface IContractInputProps {
  name: string;
  controller?: string;
  related?: string;
  prefix?: string;
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
  const { name, controller = "contracts", prefix = "contract", data = {} } = props;

  const form = useFormContext<any>();

  const handleChange = (_event: ChangeEvent<unknown>, option: any): void => {
    form.setValue(name, option?.id ?? 0, { shouldDirty: true });
    form.setValue(`${prefix}.address`, option?.address ?? "0x");
    form.setValue(`${prefix}.decimals`, option?.decimals ?? 0);
    form.setValue(`${prefix}.contractFeatures`, option?.contractFeatures ?? []);
  };

  return <EntityInput name={name} controller={controller} data={data} onChange={handleChange} autoselect />;
};
