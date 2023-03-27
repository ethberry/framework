import { FC } from "react";

import { FormWrapper } from "@gemunion/mui-form";

import { validationSchema } from "./validation";
import { AddressInput } from "./address-input";
import { UserInput } from "./user-input";
import { FormButtons } from "../form-buttons";
import { emptyAddress, emptyUser } from "../../../../components/common/interfaces";
import { useApiCall } from "@gemunion/react-hooks";

export const GuestForm: FC = () => {
  const { fn: handleSubmitApi } = useApiCall(
    (api, data: any) =>
      api.fetchJson({
        url: "/orders/guest",
        method: "POST",
        data,
      }),
    { success: false },
  );

  const handleSubmit = (values: any) => {
    return handleSubmitApi(undefined, values);
  };

  const fixedValues = {
    user: emptyUser,
    addresses: [emptyAddress],
    captcha: "",
    save: false,
  };

  return (
    <FormWrapper
      initialValues={fixedValues}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
      showButtons={false}
    >
      <AddressInput name="addresses" />
      <UserInput name="user" />
      <FormButtons submit="checkout" />
    </FormWrapper>
  );
};
