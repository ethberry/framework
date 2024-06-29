import { ChangeEvent, FC } from "react";
import { useFormContext } from "react-hook-form";

import { EntityInput } from "@gemunion/mui-inputs-entity";
import { IDiscrete } from "@framework/types";

export interface IAttributeInputProps {
  name: string;
  data: {
    contractId: number;
  };
}

export const AttributeInput: FC<IAttributeInputProps> = props => {
  const { name = "discreteId", data = {} } = props;

  const form = useFormContext<any>();

  const handleChange = (_event: ChangeEvent<unknown>, option: any): void => {
    form.setValue(name, option?.id ?? 0, { shouldDirty: true });
    form.setValue("attribute", option?.attribute);
    form.setValue("price", option?.price);
  };

  return (
    <EntityInput
      autoselect
      name={name}
      controller="discrete"
      getTitle={({ attribute }: IDiscrete) => attribute}
      onChange={handleChange}
      data={data}
    />
  );
};
