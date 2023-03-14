import { FC, Fragment } from "react";
import { Paper } from "@mui/material";
import { useWatch } from "react-hook-form";

import { CheckboxInput, PasswordInput, TextInput } from "@gemunion/mui-inputs-core";

import { useStyles } from "./styles";

export interface IUserInputProps {
  name: string;
}

export const UserInput: FC<IUserInputProps> = props => {
  const { name = "user" } = props;

  const classes = useStyles();

  const saveValue = useWatch({ name: "save" });

  return (
    <Paper className={classes.paper}>
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
