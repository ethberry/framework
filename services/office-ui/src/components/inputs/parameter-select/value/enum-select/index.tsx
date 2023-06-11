import { FC } from "react";

import { SelectInput } from "../../select";

export interface IEnumSelectInputProps {
  name: string;
  options: string[];
  prefix: string;
}

export const EnumSelectInput: FC<IEnumSelectInputProps> = props => {
  const { name, options = [], prefix } = props;

  return <SelectInput name={name} options={options} prefix={prefix} />;
};
