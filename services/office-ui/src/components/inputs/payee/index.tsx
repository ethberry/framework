import { ChangeEvent, FC } from "react";
import { useFormContext } from "react-hook-form";

import { EntityInput } from "@gemunion/mui-inputs-entity";

export interface IPayeeInputProps {
  name: string;
  controller?: string;
}

export interface IPayeeData {
  id: number;
  account: string;
  shares: number;
}
export const PayeeInput: FC<IPayeeInputProps> = props => {
  const { name, controller = "users" } = props;
  const data = {};
  const form = useFormContext<any>();

  const handleChange = (_event: ChangeEvent<unknown>, option: any): void => {
    form.setValue(name, option?.account ? option?.account : option?.wallet ? option?.wallet : "0x", {
      shouldDirty: true,
    });
    form.setValue(`shares`, option?.shares ?? 0);
  };

  return (
    <EntityInput
      name={name}
      controller={controller}
      data={data}
      onChange={handleChange}
      getTitle={(payee: IPayeeData) => `${payee.account} - ${payee.shares}%`}
    />
  );
};
