import { FC, Fragment } from "react";

import { PasswordInput, TextInput } from "@gemunion/mui-inputs-core";
import { Captcha } from "@gemunion/mui-inputs-captcha";

export const DefaultRegistrationFields: FC = () => {
  return (
    <Fragment>
      <TextInput name="email" />
      <TextInput name="displayName" />
      <PasswordInput name="password" autoComplete="new-password" />
      <PasswordInput name="confirm" autoComplete="new-password" />
      <Captcha />
    </Fragment>
  );
};
