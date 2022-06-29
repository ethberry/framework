import { FC } from "react";
import { useWatch } from "react-hook-form";

import { EntityInput } from "@gemunion/mui-inputs-entity";
import { Erc20ContractTemplate, TokenType, UniContractStatus, UniContractRole } from "@framework/types";

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
          controller="erc1155-collections"
          data={{
            contractStatus: [UniContractStatus.ACTIVE],
          }}
        />
      );
    case TokenType.ERC721:
      return (
        <EntityInput
          name={`${prefix}.${name}`}
          controller="erc721-collections"
          data={{
            collectionType: [UniContractRole.TOKEN],
            contractStatus: [UniContractStatus.ACTIVE],
          }}
        />
      );
    case TokenType.ERC998:
      return (
        <EntityInput
          name={`${prefix}.${name}`}
          controller="erc998-collections"
          data={{
            collectionType: [UniContractRole.TOKEN],
            contractStatus: [UniContractStatus.ACTIVE],
          }}
        />
      );
    case TokenType.NATIVE:
      return (
        <EntityInput
          name={`${prefix}.${name}`}
          controller="erc20-tokens"
          data={{
            contractTemplate: [Erc20ContractTemplate.NATIVE],
            tokenStatus: [UniContractStatus.ACTIVE],
          }}
        />
      );
    case TokenType.ERC20:
      return (
        <EntityInput
          name={`${prefix}.${name}`}
          controller="erc20-tokens"
          data={{
            contractTemplate: [
              Erc20ContractTemplate.EXTERNAL,
              Erc20ContractTemplate.BLACKLIST,
              Erc20ContractTemplate.SIMPLE,
            ],
            tokenStatus: [UniContractStatus.ACTIVE],
          }}
        />
      );
    default:
      return null;
  }
};
