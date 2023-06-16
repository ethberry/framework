import { FC } from "react";
import { TextInput } from "@gemunion/mui-inputs-core";

export interface ISelectInputProps {
  name?: string;
}

export const ParameterNameInput: FC<ISelectInputProps> = props => {
  const { name = "parameterName" } = props;

  return <TextInput name={name} />;
};
