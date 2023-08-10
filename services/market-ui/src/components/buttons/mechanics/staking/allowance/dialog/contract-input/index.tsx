import { ChangeEvent, FC } from "react";
import { useFormContext, useWatch } from "react-hook-form";

import { EntityInput } from "@gemunion/mui-inputs-entity";

export const ContractInput: FC = () => {
  const tokenType = useWatch({ name: "contract.tokenType" });
  const contractId = useWatch({ name: "contract.contractId" });
  const form = useFormContext<any>();

  const handleChange = (_event: ChangeEvent<unknown>, option: any): void => {
    form.setValue("contractId", option?.id ?? 0);
    form.setValue("contract.contractId", option?.id ?? 0);
    form.setValue("contract.address", option?.address ?? "0x");
    form.setValue("contract.contractType", option?.contractType ?? "0x");
    form.setValue("contract.decimals", option?.decimals ?? 0);
  };

  return (
    <EntityInput
      name="contractId"
      controller="contracts"
      data={{ contractId, contractType: [tokenType] }}
      onChange={handleChange}
      autoselect
      disableClear
    />
  );
};
