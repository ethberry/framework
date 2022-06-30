import { FC } from "react";
import { useWatch } from "react-hook-form";

import { EntityInput } from "@gemunion/mui-inputs-entity";
import { Erc20ContractTemplate, TokenType, UniContractRole, UniContractStatus } from "@framework/types";

export interface IUniContractInputProps {
  prefix: string;
  name?: string;
}

export const UniContractInput: FC<IUniContractInputProps> = props => {
  const { prefix, name = "uniContractId" } = props;

  const tokenType = useWatch({ name: `${prefix}.tokenType` });

  switch (tokenType) {
    case TokenType.ERC1155:
      return (
        <EntityInput
          name={`${prefix}.${name}`}
          controller="uni-contracts"
          data={{
            contractStatus: [UniContractStatus.ACTIVE],
            contractType: [TokenType.ERC1155],
          }}
        />
      );
    case TokenType.ERC721:
      return (
        <EntityInput
          name={`${prefix}.${name}`}
          controller="uni-contracts"
          data={{
            contractRole: [UniContractRole.TOKEN],
            contractStatus: [UniContractStatus.ACTIVE],
            contractType: [TokenType.ERC721],
          }}
        />
      );
    case TokenType.ERC998:
      return (
        <EntityInput
          name={`${prefix}.${name}`}
          controller="uni-contracts"
          data={{
            contractRole: [UniContractRole.TOKEN],
            contractStatus: [UniContractStatus.ACTIVE],
            contractType: [TokenType.ERC998],
          }}
        />
      );
    case TokenType.NATIVE:
      return (
        <EntityInput
          name={`${prefix}.${name}`}
          controller="uni-contracts"
          data={{
            contractTemplate: [Erc20ContractTemplate.NATIVE],
            contractStatus: [UniContractStatus.ACTIVE],
            contractType: [TokenType.ERC998],
          }}
        />
      );
    case TokenType.ERC20:
      return (
        <EntityInput
          name={`${prefix}.${name}`}
          controller="uni-contracts"
          data={{
            contractTemplate: [
              Erc20ContractTemplate.EXTERNAL,
              Erc20ContractTemplate.BLACKLIST,
              Erc20ContractTemplate.SIMPLE,
            ],
            contractStatus: [UniContractStatus.ACTIVE],
            contractType: [TokenType.ERC20],
          }}
        />
      );
    default:
      return null;
  }
};
