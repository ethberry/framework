import { FC } from "react";
import { useWatch } from "react-hook-form";

import { EthInput } from "@gemunion/mui-inputs-mask";

import { ItemType } from "../interfaces";

export interface ITokenInputProps {
  prefix: string;
  name?: string;
  related?: string;
}

export const AmountInput: FC<ITokenInputProps> = props => {
  const { prefix, name = "amount", related = "itemType" } = props;

  const value = useWatch({ name: `${prefix}.${related}` });

  switch (value) {
    case ItemType.NATIVE:
    case ItemType.ERC20:
    case ItemType.ERC1155:
      return <EthInput name={`${prefix}.${name}`} />;
    case ItemType.ERC721:
    default:
      return null;
  }
};
