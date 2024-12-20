import { FC } from "react";

import { FormWrapper } from "@gemunion/mui-form";
import { useApiCall } from "@gemunion/react-hooks";

import { AddressSelectInput } from "../../../../components/inputs/address-select";
import { validationSchema } from "./validation";
import { FormButtons } from "../form-buttons";

export const UserForm: FC = () => {
  const { fn: handleSubmitApi } = useApiCall((api, values) =>
    api.fetchJson({
      url: "/orders/user",
      method: "POST",
      data: values,
    }),
  );

  const handleSubmit = (values: any, form: any) => {
    return handleSubmitApi(form, values);
  };

  const fixedValues = { addressId: null };

  return (
    <FormWrapper
      initialValues={fixedValues}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
      showButtons={false}
    >
      <AddressSelectInput />
      <FormButtons submit="checkout" />
    </FormWrapper>
  );
};
