import { forwardRef } from "react";
import NumberFormat from "react-number-format";

export const MaskedInputWrapper = forwardRef<NumberFormat<any>>(function NumberFormatCustom(props, ref) {
  return <NumberFormat {...props} getInputRef={ref} />;
});
