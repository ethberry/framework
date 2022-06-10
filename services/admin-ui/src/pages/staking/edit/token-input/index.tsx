import { FC } from "react";
import { useWatch } from "react-hook-form";

import { EntityInput } from "@gemunion/mui-inputs-entity";
import { TokenType, Erc20TokenStatus, Erc20TokenTemplate } from "@framework/types";

export interface ITokenInputProps {
  prefix: string;
  name?: string;
  related?: string;
}

export const TokenInput: FC<ITokenInputProps> = props => {
  const { prefix, name = "token", related = "tokenType" } = props;

  const value = useWatch({ name: `${prefix}.${related}` });

  switch (value) {
    case TokenType.ERC1155:
      return <EntityInput name={`${prefix}.${name}`} controller="erc1155-collections" />;
    case TokenType.ERC721:
      return <EntityInput name={`${prefix}.${name}`} controller="erc721-collections" />;
    case TokenType.ERC998:
      return <EntityInput name={`${prefix}.${name}`} controller="erc998-collections" />;
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
