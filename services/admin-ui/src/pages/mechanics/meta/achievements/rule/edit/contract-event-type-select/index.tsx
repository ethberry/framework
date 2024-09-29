import { FC, useEffect, useState } from "react";
import { useFormContext, useWatch } from "react-hook-form";

import { SelectInput } from "@ethberry/mui-inputs-core";

import { getEventTypeByContractModule } from "./utils";

export const SelectContractEventTypeInput: FC = () => {
  const name = "eventType";
  const contract = useWatch({ name: "contract" });
  const form = useFormContext();
  const [eventTypes, setEventTypes] = useState(getEventTypeByContractModule(contract));

  useEffect(() => {
    const newEventTypes = getEventTypeByContractModule(contract);
    setEventTypes(newEventTypes);
    form.setValue(name, newEventTypes[Object.values(newEventTypes)[0]], { shouldDirty: true });
  }, [contract]);

  if (!contract) {
    return null;
  }

  return <SelectInput name={name} options={eventTypes} />;
};
