import { FC } from "react";
import { useWatch } from "react-hook-form";

import { EntityInput } from "@gemunion/mui-inputs-entity";
import {
  Erc1155CollectionStatus,
  Erc20TokenStatus,
  Erc20TokenTemplate,
  Erc721CollectionStatus,
  Erc721CollectionType,
  Erc998CollectionStatus,
  Erc998CollectionType,
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
            collectionStatus: [Erc1155CollectionStatus.ACTIVE],
          }}
        />
      );
    case TokenType.ERC721:
      return (
        <EntityInput
          name={`${prefix}.${name}`}
          controller="erc721-collections"
          data={{
            collectionType: [Erc721CollectionType.TOKEN],
            collectionStatus: [Erc721CollectionStatus.ACTIVE],
          }}
        />
      );
    case TokenType.ERC721D:
      return (
        <EntityInput
          name={`${prefix}.${name}`}
          controller="erc721-collections"
          data={{
            collectionType: [Erc721CollectionType.DROPBOX],
            collectionStatus: [Erc721CollectionStatus.ACTIVE],
          }}
        />
      );
    case TokenType.ERC998:
      return (
        <EntityInput
          name={`${prefix}.${name}`}
          controller="erc998-collections"
          data={{
            collectionType: [Erc998CollectionType.TOKEN],
            collectionStatus: [Erc998CollectionStatus.ACTIVE],
          }}
        />
      );
    case TokenType.ERC998D:
      return (
        <EntityInput
          name={`${prefix}.${name}`}
          controller="erc998-collections"
          data={{
            collectionType: [Erc998CollectionType.DROPBOX],
            collectionStatus: [Erc998CollectionStatus.ACTIVE],
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
            tokenStatus: [Erc20TokenStatus.ACTIVE],
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
            tokenStatus: [Erc20TokenStatus.ACTIVE],
          }}
        />
      );
    default:
      return null;
  }
};
