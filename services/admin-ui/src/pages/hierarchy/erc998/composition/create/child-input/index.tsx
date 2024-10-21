import { FC } from "react";
import { useWatch } from "react-hook-form";

import { ContractFeatures, ContractStatus, ModuleType, TokenType } from "@framework/types";

import { ContractInput } from "../../../../../../components/inputs/contract";

export interface IErc998CompositionChildInputProps {
  name: string;
  prefix: string;
}

export const Erc998CompositionChildInput: FC<IErc998CompositionChildInputProps> = props => {
  const { name = "childId", prefix } = props;

  const values = useWatch();

  const contractType = [TokenType.ERC721, TokenType.ERC998];

  if (values.parent.contractFeatures.includes(ContractFeatures.ERC20OWNER)) {
    contractType.push(TokenType.ERC20);
  }

  if (values.parent.contractFeatures.includes(ContractFeatures.ERC1155OWNER)) {
    contractType.push(TokenType.ERC1155);
  }

  return (
    <ContractInput
      name={name}
      prefix={prefix}
      data={{
        contractType,
        contractStatus: [ContractStatus.ACTIVE, ContractStatus.NEW],
        contractModule: [ModuleType.HIERARCHY],
      }}
    />
  );
};
