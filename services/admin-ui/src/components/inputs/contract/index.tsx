import { ChangeEvent, FC } from "react";
import { useFormContext } from "react-hook-form";

import { EntityInput } from "@gemunion/mui-inputs-entity";
import {
  ContractStatus,
  Erc721ContractFeatures,
  Erc998ContractFeatures,
  ModuleType,
  TokenType,
} from "@framework/types";

export interface IContractInputProps {
  name: string;
  controller?: string;
  related?: string;
  data?: {
    contractType?: Array<TokenType>;
    contractStatus?: Array<ContractStatus>;
    contractModule?: Array<ModuleType>;
  };
}

export const ContractInput: FC<IContractInputProps> = props => {
  const { name, controller = "contracts", related = "address", data = {} } = props;

  const form = useFormContext<any>();

  const handleChange = (_event: ChangeEvent<unknown>, option: any | null): void => {
    form.setValue(name, option?.id ?? 0);
    form.setValue(`contract.${related}`, option?.address ?? "0x");
    form.setValue("contract.decimals", option?.decimals ?? 0);
  };

  return <EntityInput name={name} controller={controller} data={data} onChange={handleChange} />;
};
