import { number, object, string } from "yup";

import { templateAssetValidationSchema } from "@ethberry/mui-inputs-asset";
import {
  draftValidationSchema,
  titleValidationSchema,
  urlValidationSchema,
  currencyValidationSchema,
} from "@ethberry/yup-rules";
import { ShapeType } from "@framework/types";

import { afterCliffBasisPointsShapes, cliffShapes, growthRateShapes, periodShapes } from "./constants";

export const validationSchema = object().shape({
  title: titleValidationSchema,
  description: draftValidationSchema,
  content: templateAssetValidationSchema,
  price: templateAssetValidationSchema,
  imageUrl: urlValidationSchema,
  shape: string().required("form.validations.valueMissing"),
  startTimestamp: string().required("form.validations.valueMissing"),
  duration: number()
    .typeError("form.validations.typeMismatch")
    .min(1, "form.validations.rangeUnderflow")
    .required("form.validations.valueMissing"),
  period: number().when("shape", {
    is: (value: ShapeType) => periodShapes.includes(value),
    then: schema => schema.min(1, "form.validations.rangeUnderflow").required("form.validations.valueMissing"),
  }),
  cliff: number().when("shape", {
    is: (value: ShapeType) => cliffShapes.includes(value),
    then: schema => schema.typeError("form.validations.typeMismatch").required("form.validations.valueMissing"),
  }),
  afterCliffBasisPoints: number().when("shape", {
    is: (value: ShapeType) => afterCliffBasisPointsShapes.includes(value),
    then: () => currencyValidationSchema,
  }),
  growthRate: number().when("shape", {
    is: (value: ShapeType) => growthRateShapes.includes(value),
    then: schema => schema.typeError("form.validations.typeMismatch").required("form.validations.valueMissing"),
  }),
});
