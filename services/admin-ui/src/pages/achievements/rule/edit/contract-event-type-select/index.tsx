import { FC } from "react";
import { useWatch } from "react-hook-form";

import { SelectInput } from "@gemunion/mui-inputs-core";

import { getEventTypeByContractModule } from "./utils";

export const SelectContractEventTypeInput: FC = () => {
  const contract = useWatch({ name: "contract" });

  return <SelectInput name="eventType" options={getEventTypeByContractModule(contract)} />;
};
