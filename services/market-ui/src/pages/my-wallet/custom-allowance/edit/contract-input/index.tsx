import { ChangeEvent, FC } from "react";
import { useFormContext, useWatch } from "react-hook-form";

import { EntityInput } from "@gemunion/mui-inputs-entity";
import { ContractStatus, TokenType } from "@framework/types";

export const ContractInput: FC = () => {
  const tokenType = useWatch({ name: "tokenType" });
  const form = useFormContext<any>();

  const handleChange = (_event: ChangeEvent<unknown>, option: any | null): void => {
    form.setValue("contractId", option?.id ?? 0);
    form.setValue("address", option?.address ?? "0x");
    form.setValue("decimals", option?.decimals ?? 0);
  };

  switch (tokenType) {
    case TokenType.ERC20:
      return (
        <EntityInput
          name="contractId"
          controller="contracts"
          data={{
            contractStatus: [ContractStatus.ACTIVE],
            contractType: [TokenType.ERC20],
          }}
          onChange={handleChange}
        />
      );
    case TokenType.ERC721:
      return (
        <EntityInput
          name="contractId"
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
          name="contractId"
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
          name="contractId"
          controller="contracts"
          data={{
            contractStatus: [ContractStatus.ACTIVE],
            contractType: [TokenType.ERC1155],
          }}
          onChange={handleChange}
        />
      );
    case TokenType.NATIVE:
    default:
      return null;
  }
};
