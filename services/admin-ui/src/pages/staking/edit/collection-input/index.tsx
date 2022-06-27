import { FC } from "react";
import { useWatch } from "react-hook-form";

import { EntityInput } from "@gemunion/mui-inputs-entity";
import {
  UniContractStatus,
  UniTokenStatus,
  Erc20TokenTemplate,
  UniContractStatus,
  UniContractType,
  UniContractStatus,
  UniContractType,
  TokenType,
} from "@framework/types";

export interface ITokenInputProps {
  prefix: string;
  name?: string;
}

export const CollectionInput: FC<ITokenInputProps> = props => {
  const { prefix, name = "collection" } = props;

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
            collectionType: [UniContractType.TOKEN],
            contractStatus: [UniContractStatus.ACTIVE],
          }}
        />
      );
    case TokenType.ERC721D:
      return (
        <EntityInput
          name={`${prefix}.${name}`}
          controller="erc721-collections"
          data={{
            collectionType: [UniContractType.DROPBOX],
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
            collectionType: [UniContractType.TOKEN],
            contractStatus: [UniContractStatus.ACTIVE],
          }}
        />
      );
    case TokenType.ERC998D:
      return (
        <EntityInput
          name={`${prefix}.${name}`}
          controller="erc998-collections"
          data={{
            collectionType: [UniContractType.DROPBOX],
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
            contractTemplate: [Erc20TokenTemplate.NATIVE],
            tokenStatus: [UniTokenStatus.ACTIVE],
          }}
        />
      );
    case TokenType.ERC20:
      return (
        <EntityInput
          name={`${prefix}.${name}`}
          controller="erc20-tokens"
          data={{
            contractTemplate: [Erc20TokenTemplate.EXTERNAL, Erc20TokenTemplate.BLACKLIST, Erc20TokenTemplate.SIMPLE],
            tokenStatus: [UniTokenStatus.ACTIVE],
          }}
        />
      );
    default:
      return null;
  }
};
