import { FC, useContext } from "react";
import { useSnackbar } from "notistack";
import { useIntl } from "react-intl";

import { ApiContext, ApiError } from "@gemunion/provider-api-firebase";
import { FormWrapper } from "@gemunion/mui-form";

import { AddressInput } from "./address-input";
import { validationSchema } from "./validation";
import { FormButtons } from "../form-buttons";

export const UserForm: FC = () => {
  const { enqueueSnackbar } = useSnackbar();
  const { formatMessage } = useIntl();

  const api = useContext(ApiContext);

  const handleSubmit = (values: any) => {
    return api
      .fetchJson({
        url: "/orders/user",
        method: "POST",
        data: values,
      })
      .catch((e: ApiError) => {
        if (e.status) {
          enqueueSnackbar(formatMessage({ id: `snackbar.${e.message}` }), { variant: "error" });
        } else {
          console.error(e);
          enqueueSnackbar(formatMessage({ id: "snackbar.error" }), { variant: "error" });
        }
      });
  };

  const fixedValues = { addressId: null };

  return (
    <FormWrapper
      initialValues={fixedValues}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
      showButtons={false}
    >
      <AddressInput name="addressId" />
      <FormButtons submit="checkout" />
    </FormWrapper>
  );
};
