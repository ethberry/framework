import * as Yup from "yup";

export const validationSchema = Yup.object().shape({
  withdrawDeposit: Yup.boolean(),
  breakLastPeriod: Yup.boolean(),
});
