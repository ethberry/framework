import { ChangeEvent, FC } from "react";
import { useFormContext } from "react-hook-form";

import { EntityInput } from "@gemunion/mui-inputs-entity";
import { ContractStatus, Erc721ContractFeatures, Erc998ContractFeatures, TokenType } from "@framework/types";

export interface IContractInputProps {
  name: string;
  related?: string;
  data?: {
    contractType?: Array<TokenType>;
    contractStatus?: Array<ContractStatus>;
    contractFeatures?: Array<Erc721ContractFeatures | Erc998ContractFeatures>;
    excludeFeatures?: Array<Erc721ContractFeatures | Erc998ContractFeatures>;
  };
}

export const ContractInput: FC<IContractInputProps> = props => {
  const { name, related = "address", data = {} } = props;

  const form = useFormContext<any>();

  const handleChange = (_event: ChangeEvent<unknown>, option: any | null): void => {
    form.setValue(name, option?.id ?? 0);
    form.setValue(related, option?.address ?? "0x");
  };

  return <EntityInput name={name} controller="contracts" data={data} onChange={handleChange} />;
};
