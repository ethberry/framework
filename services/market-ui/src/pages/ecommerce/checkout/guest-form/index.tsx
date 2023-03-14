import { FC, useContext } from "react";
import { useSnackbar } from "notistack";
import { useIntl } from "react-intl";

import { ApiContext, ApiError } from "@gemunion/provider-api-firebase";
import { FormWrapper } from "@gemunion/mui-form";

import { validationSchema } from "./validation";
import { AddressInput } from "./address-input";
import { UserInput } from "./user-input";
import { FormButtons } from "../form-buttons";
import { emptyAddr, emptyUser } from "../../../../components/common/interfaces";

export const GuestForm: FC = () => {
  const { enqueueSnackbar } = useSnackbar();
  const { formatMessage } = useIntl();

  const api = useContext(ApiContext);

  const handleSubmit = (values: any) => {
    return api
      .fetchJson({
        url: "/orders/guest",
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

  const fixedValues = {
    user: emptyUser,
    addresses: [emptyAddr],
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
