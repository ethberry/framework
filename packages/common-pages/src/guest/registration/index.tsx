import { FC } from "react";

import { validationSchema } from "./validation";
import { initialValues } from "./utils";
import { DefaultRegistrationFields } from "./fields";
import { RegistrationBase } from "./base";

export const Registration: FC = () => {
  return (
    <RegistrationBase initialValues={initialValues} validationSchema={validationSchema}>
      <DefaultRegistrationFields />
    </RegistrationBase>
  );
};
