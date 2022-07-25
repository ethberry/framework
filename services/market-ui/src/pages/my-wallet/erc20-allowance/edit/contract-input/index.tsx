import { ChangeEvent, FC } from "react";
import { useFormContext } from "react-hook-form";

import { EntityInput } from "@gemunion/mui-inputs-entity";
import { Erc20ContractTemplate, TokenType } from "@framework/types";

export interface IContractInputProps {
  name: string;
  related: string;
}

export const ContractInput: FC<IContractInputProps> = props => {
  const { name, related = "address" } = props;

  const form = useFormContext<any>();

  return (
    <EntityInput
      name={name}
      controller="contracts"
      data={{
        contractType: [TokenType.ERC20],
        contractTemplate: [
          Erc20ContractTemplate.SIMPLE,
          Erc20ContractTemplate.BLACKLIST,
          Erc20ContractTemplate.EXTERNAL,
        ],
      }}
      onChange={(_event: ChangeEvent<unknown>, option: any | null): void => {
        if (option) {
          form.setValue(name, option.id);
          form.setValue(related, option.address);
        } else {
          form.setValue(name, 0);
          form.setValue(related, "");
        }
      }}
    />
  );
};
