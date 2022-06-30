import { FC } from "react";
import { useWatch } from "react-hook-form";

import { EntityInput } from "@gemunion/mui-inputs-entity";
import { Erc20ContractTemplate, TokenType, ContractRole, ContractStatus } from "@framework/types";

export interface IContractInputProps {
  prefix: string;
  name?: string;
}

export const ContractInput: FC<IContractInputProps> = props => {
  const { prefix, name = "contractId" } = props;

  const tokenType = useWatch({ name: `${prefix}.tokenType` });

  switch (tokenType) {
    case TokenType.ERC1155:
      return (
        <EntityInput
          name={`${prefix}.${name}`}
          controller="uni-contracts"
          data={{
            contractStatus: [ContractStatus.ACTIVE],
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
            contractRole: [ContractRole.TOKEN],
            contractStatus: [ContractStatus.ACTIVE],
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
            contractRole: [ContractRole.TOKEN],
            contractStatus: [ContractStatus.ACTIVE],
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
            contractStatus: [ContractStatus.ACTIVE],
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
            contractStatus: [ContractStatus.ACTIVE],
            contractType: [TokenType.ERC20],
          }}
        />
      );
    default:
      return null;
  }
};
