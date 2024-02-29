import { array, number, object } from "yup";

export const validationSchema = object().shape({
  levels: array()
    .of(
      object().shape({
        merchantId: number().min(1, "form.validations.rangeUnderflow").required("form.validations.valueMissing"),
        level: number().min(0, "form.validations.rangeUnderflow").required("form.validations.valueMissing"),
        share: number()
          .min(1, "form.validations.rangeUnderflow")
          .max(10000, "form.validations.rangeOverflow")
          .required(),
      }),
    )
    .test("total-mismatch", (levels, { createError }) => {
      const sum = levels?.reduce((partialSum, lev) => partialSum + lev.share, 0) || 0;
      const levelZeroTotal = levels ? levels[0].share : 0;
      return (
        (levelZeroTotal > 0 && sum / levelZeroTotal === 2) ||
        createError({
          path: "levels[0].share",
          message: "form.validations.totalMismatch",
        })
      );
    })
    .required("form.validations.valueMissing"),
});
