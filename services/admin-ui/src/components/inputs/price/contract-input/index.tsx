import { ChangeEvent, FC } from "react";
import { useFormContext, useWatch } from "react-hook-form";

import { EntityInput } from "@gemunion/mui-inputs-entity";
import { ContractStatus, Erc20ContractTemplate, TokenType } from "@framework/types";

export interface IContractInputProps {
  prefix: string;
  name?: string;
}

export const ContractInput: FC<IContractInputProps> = props => {
  const { prefix, name = "contractId" } = props;

  const tokenType = useWatch({ name: `${prefix}.tokenType` });
  const form = useFormContext<any>();

  const handleChange = (_event: ChangeEvent<unknown>, option: any | null): void => {
    form.setValue(`${prefix}.${name}`, option?.id ?? 0);
    // form.setValue(`${prefix}.address`, option?.address ?? "0x");
    form.setValue(`${prefix}.decimals`, option?.decimals ?? 0);
  };

  switch (tokenType) {
    case TokenType.NATIVE:
      return (
        <EntityInput
          name={`${prefix}.${name}`}
          controller="contracts"
          data={{
            contractTemplate: [Erc20ContractTemplate.NATIVE],
            contractStatus: [ContractStatus.ACTIVE],
            contractType: [TokenType.ERC20],
          }}
          onChange={handleChange}
        />
      );
    case TokenType.ERC20:
      return (
        <EntityInput
          name={`${prefix}.${name}`}
          controller="contracts"
          data={{
            contractTemplate: [
              Erc20ContractTemplate.EXTERNAL,
              Erc20ContractTemplate.BLACKLIST,
              Erc20ContractTemplate.SIMPLE,
            ],
            contractStatus: [ContractStatus.ACTIVE],
            contractType: [TokenType.ERC20],
          }}
          onChange={handleChange}
        />
      );
    case TokenType.ERC721:
      return (
        <EntityInput
          name={`${prefix}.${name}`}
          controller="contracts"
          data={{
            contractStatus: [ContractStatus.ACTIVE],
            contractType: [TokenType.ERC721],
          }}
          onChange={handleChange}
        />
      );
    case TokenType.ERC998:
      return (
        <EntityInput
          name={`${prefix}.${name}`}
          controller="contracts"
          data={{
            contractStatus: [ContractStatus.ACTIVE],
            contractType: [TokenType.ERC998],
          }}
          onChange={handleChange}
        />
      );
    case TokenType.ERC1155:
      return (
        <EntityInput
          name={`${prefix}.${name}`}
          controller="contracts"
          data={{
            contractStatus: [ContractStatus.ACTIVE],
            contractType: [TokenType.ERC1155],
          }}
          onChange={handleChange}
        />
      );
    default:
      return null;
  }
};
