import { FC } from "react";
import { useWatch } from "react-hook-form";

import { EntityInput } from "@gemunion/mui-inputs-entity";

interface IWaitListInputProps {
  name?: string;
}

export const WaitListInput: FC<IWaitListInputProps> = props => {
  const { name = "listIds" } = props;

  const merchantId = useWatch({ name: "merchantId" });

  return <EntityInput name={name} controller="wait-list/list" multiple data={{ merchantId }} />;
};
