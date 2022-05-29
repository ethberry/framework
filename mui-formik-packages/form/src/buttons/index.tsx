import { FC, forwardRef } from "react";
import { useFormContext } from "react-hook-form";
import { Button } from "@mui/material";
import { FormattedMessage } from "react-intl";

import { ButtonToolbar } from "@gemunion/mui-page-layout";

interface IFormButtonsProps {
  visible?: boolean;
  submit?: string;
  handleSubmit: (e: any) => any;
  ref?: any;
}

export const FormButtons: FC<IFormButtonsProps> = forwardRef((props, ref: any) => {
  const { visible = true, submit = "submit", handleSubmit } = props;

  const {
    formState: { isSubmitting, isValid, isDirty },
  } = useFormContext();

  const disabled = isSubmitting || (!isValid && isDirty);

  if (!visible) {
    return null;
  }

  return (
    <ButtonToolbar>
      <Button
        onClick={handleSubmit}
        ref={ref}
        variant="contained"
        color="primary"
        disabled={disabled}
        data-testid="formSubmitButton"
      >
        <FormattedMessage id={`form.buttons.${submit}`} />
      </Button>
    </ButtonToolbar>
  );
});
