import { ChangeEvent, FC } from "react";
import { useFormContext } from "react-hook-form";

import { EntityInput } from "@gemunion/mui-inputs-entity";
import { TokenType } from "@framework/types";

export interface IContractInputProps {
  name: string;
}

export const ContractInput: FC<IContractInputProps> = props => {
  const { name } = props;

  const form = useFormContext<any>();

  return (
    <EntityInput
      name={name}
      controller="contracts"
      data={{ contractType: [TokenType.ERC20] }}
      onChange={(_event: ChangeEvent<unknown>, option: any | null): void => {
        const value = option ? option.address : null;
        form.setValue(name, value, { shouldTouch: true });
      }}
    />
  );
};
