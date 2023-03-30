import { ChangeEvent, FC } from "react";
import { useFormContext } from "react-hook-form";

import { TokenType } from "@framework/types";
import { EntityInput } from "@gemunion/mui-inputs-entity";

export const ContractInput: FC = () => {
  const form = useFormContext<any>();

  const handleChange = (_event: ChangeEvent<unknown>, option: any | null): void => {
    form.setValue("contractId", option?.id ?? 0);
    form.setValue("contract.address", option?.address ?? "0x");
    form.setValue("contract.contractType", option?.contractType ?? "0x");
    form.setValue("contract.decimals", option?.decimals ?? 0);
  };

  return (
    <EntityInput
      name="contractId"
      controller="contracts"
      data={{ contractType: [TokenType.ERC20] }}
      onChange={handleChange}
      autoselect
    />
  );
};
