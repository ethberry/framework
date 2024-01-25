import { FC, useEffect } from "react";
import { useFormContext, useWatch } from "react-hook-form";

import { EntityInput } from "@gemunion/mui-inputs-entity";
import { InputType } from "@gemunion/types-collection";
import { ModuleType } from "@framework/types";

export const StakingContractInput: FC = () => {
  const form = useFormContext();
  const merchantId = useWatch({ name: "merchantId" });

  useEffect(() => {
    form.setValue("contractId", InputType.awaited);
  }, [merchantId]);

  return (
    <EntityInput
      name="contractId"
      controller="contracts"
      data={{
        contractModule: [ModuleType.STAKING],
        merchantId,
      }}
      autoselect
      disableClear
    />
  );
};
