import { forwardRef } from "react";
import { IMaskInput } from "react-imask";

export const MaskedInputWrapper = forwardRef<any, any>((props, inputRef) => {
  const { maskedRef, ...rest } = props;

  return (
    <IMaskInput
      {...rest}
      ref={(ref: any) => {
        if (ref && maskedRef && !maskedRef.current) {
          maskedRef.current = ref.maskRef;
        }
        // @ts-ignore
        inputRef(ref ? ref.inputElement : null);
      }}
    />
  );
});
