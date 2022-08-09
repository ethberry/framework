import { ChangeEvent, FC } from "react";
import { useFormContext, useWatch } from "react-hook-form";

import { EntityInput } from "@gemunion/mui-inputs-entity";
import { ContractStatus, TokenType } from "@framework/types";

export const ContractInput: FC = () => {
  const form = useFormContext<any>();
  const tokenType: TokenType = useWatch({ name: "tokenType" });

  return (
    <EntityInput
      name="contractId"
      controller="contracts"
      data={{
        contractType: [tokenType],
        contractStatus: [ContractStatus.ACTIVE, ContractStatus.NEW],
      }}
      onChange={(_event: ChangeEvent<unknown>, option: any | null): void => {
        form.setValue("contractId", option?.id ?? 0);
        form.setValue("address", option?.address ?? "0x");
        form.setValue("decimals", option?.decimals ?? 0);
      }}
    />
  );
};
