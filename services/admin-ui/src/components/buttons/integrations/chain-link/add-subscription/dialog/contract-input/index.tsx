import { ChangeEvent, FC } from "react";
import { useFormContext } from "react-hook-form";

import { EntityInput } from "@gemunion/mui-inputs-entity";
import { ContractFeatures } from "@framework/types";

export interface IVrfConsumerInputDto {
  contractId?: number;
}

export const VrfConsumerInput: FC<IVrfConsumerInputDto> = props => {
  const { contractId } = props;

  const form = useFormContext<any>();

  const handleChange = (_event: ChangeEvent<unknown>, option: any): void => {
    form.setValue("contractId", option?.id ?? 0);
    form.setValue("address", option?.address ?? "0x");
  };

  return (
    <EntityInput
      name="contractId"
      controller="contracts"
      onChange={handleChange}
      data={{ contractId, contractFeatures: [ContractFeatures.RANDOM, ContractFeatures.GENES] }}
      autoselect
    />
  );
};
