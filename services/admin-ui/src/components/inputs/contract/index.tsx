import { ChangeEvent, FC } from "react";
import { useFormContext } from "react-hook-form";

import { EntityInput } from "@gemunion/mui-inputs-entity";
import { ContractStatus, Erc721ContractTemplate, Erc998ContractTemplate, TokenType } from "@framework/types";

export interface IContractInputProps {
  name: string;
  related?: string;
  data?: {
    contractType?: Array<TokenType>;
    contractStatus?: Array<ContractStatus>;
    contractTemplate?: Array<Erc721ContractTemplate | Erc998ContractTemplate>;
  };
}

export const ContractInput: FC<IContractInputProps> = props => {
  const { name, related = "address", data = {} } = props;

  const form = useFormContext<any>();

  return (
    <EntityInput
      name={name}
      controller="contracts"
      data={data}
      onChange={(_event: ChangeEvent<unknown>, option: any | null): void => {
        form.setValue(name, option?.id ?? 0);
        form.setValue(related, option?.address ?? "0x");
      }}
    />
  );
};
