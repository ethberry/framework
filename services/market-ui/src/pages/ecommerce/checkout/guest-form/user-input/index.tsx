import { FC, Fragment } from "react";
import { Paper } from "@mui/material";
import { useWatch } from "react-hook-form";

import { CheckboxInput, PasswordInput, TextInput } from "@gemunion/mui-inputs-core";

export interface IUserInputProps {
  name: string;
}

export const UserInput: FC<IUserInputProps> = props => {
  const { name = "user" } = props;

  const saveValue = useWatch({ name: "save" });

  return (
    <Paper sx={{ p: 2 }}>
      <TextInput name={`${name}.email`} />
      <TextInput name={`${name}.displayName`} />
      <CheckboxInput name="save" />
      {saveValue ? (
        <Fragment>
          <PasswordInput name={`${name}.password`} autoComplete="new-password" />
          <PasswordInput name={`${name}.confirm`} autoComplete="new-password" />
        </Fragment>
      ) : null}
    </Paper>
  );
};
