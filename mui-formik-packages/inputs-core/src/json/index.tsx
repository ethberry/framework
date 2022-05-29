import { FC, FocusEvent } from "react";
import { useFormContext } from "react-hook-form";
import { jsonValidationSchema } from "@gemunion/yup-rules";

import { TextArea, ITextAreaProps } from "../textarea";

export const JsonInput: FC<ITextAreaProps> = props => {
  const { name, ...rest } = props;

  const form = useFormContext<any>();

  const inputProps = {
    onBlur: (event: FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { value } = event.target;

      try {
        jsonValidationSchema.validateSync(value);

        const formattedValue = JSON.stringify(JSON.parse(value), null, "\t");
        event.target.value = formattedValue;

        form.setValue(name, formattedValue);
        form.clearErrors(name);
      } catch (e) {
        console.log('e', e);

        form.setError(name, { type: "custom", message: e.message });
      }
    },
    onFocus: () => form.setFocus(name),
  };

  return <TextArea name={name} {...inputProps} {...rest} />;
};
