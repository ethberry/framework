import { ChangeEvent, FC } from "react";
import { useFormContext } from "react-hook-form";

import { EntityInput } from "@gemunion/mui-inputs-entity";

export interface IAttributeInputProps {
  name: string;
}

export const WaitListListInput: FC<IAttributeInputProps> = props => {
  const { name = "listId" } = props;

  const form = useFormContext<any>();

  const handleChange = (_event: ChangeEvent<unknown>, option: any): void => {
    form.setValue(name, option?.id ?? 0, { shouldDirty: true });
    form.setValue("item", option?.item);
  };

  return <EntityInput autoselect name={name} controller="wait-list/list" onChange={handleChange} />;
};
