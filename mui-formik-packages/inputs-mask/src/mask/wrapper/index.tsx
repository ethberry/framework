import { forwardRef } from "react";
import { IMaskInput } from "react-imask";

export const MaskedInputWrapper = forwardRef<any, any>((props, inputRef) => {
  const { maskedRef, updateValue, ...rest } = props;

  return (
    <IMaskInput
      {...rest}
      updateValue={updateValue}
      onAccept={(value, mask) => {
        updateValue && updateValue(mask);
      }}
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
