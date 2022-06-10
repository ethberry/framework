import { FC } from "react";

import { SelectInput } from "@gemunion/mui-inputs-core";

import { ItemType } from "../interfaces";

export interface ITokenInputProps {
  prefix: string;
  name?: string;
}

export const ItemTypeInput: FC<ITokenInputProps> = props => {
  const { prefix, name = "itemType" } = props;

  return <SelectInput name={`${prefix}.${name}`} options={ItemType} />;
};
