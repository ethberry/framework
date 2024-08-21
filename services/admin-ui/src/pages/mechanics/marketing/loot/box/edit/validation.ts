import { object, number } from "yup";

import { draftValidationSchema, titleValidationSchema, urlValidationSchema } from "@gemunion/yup-rules";
import { templateAssetValidationSchema } from "@gemunion/mui-inputs-asset";

export const validationSchema = object().shape({
  title: titleValidationSchema,
  description: draftValidationSchema,
  content: templateAssetValidationSchema,
  price: templateAssetValidationSchema,
  imageUrl: urlValidationSchema,
  min: number()
    .typeError("form.validations.badInput")
    .min(1, "form.validations.rangeUnderflow")
    .required("form.validations.valueMissing")
    .test("min_should_be_less_than_max", "form.validations.rangeOverflow", function (value) {
      const { max } = this.parent;
      return !!value && value <= max;
    })
    .test("min_should_be_less_than_content_components_length", "form.validations.rangeUnderflow", function (value) {
      const { content } = this.parent;
      return !!value && value <= content.components.length;
    }),
  max: number()
    .typeError("form.validations.badInput")
    .test("max_should_be_more_than_min", "form.validations.rangeUnderflow", function (value) {
      const { min } = this.parent;
      return !!value && value >= min;
    })
    .test("max_should_be_less_than_content_components_length", "form.validations.rangeUnderflow", function (value) {
      const { content } = this.parent;
      return !!value && value <= content.components.length;
    })
    .required("form.validations.valueMissing"),
});
