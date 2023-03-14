import { FC, useContext } from "react";
import { Button } from "@mui/material";
import { useFormContext } from "react-hook-form";
import { FormattedMessage } from "react-intl";

import { ButtonToolbar } from "@gemunion/mui-page-layout";

import { CartContext } from "../../../../components/providers/cart";

interface IFormButtonsProps {
  visible?: boolean;
  submit?: string;
}

export const FormButtons: FC<IFormButtonsProps> = props => {
  const { visible = true, submit = "submit" } = props;

  const {
    formState: { isDirty, isSubmitting, isValid },
  } = useFormContext();

  const cart = useContext(CartContext);

  const disabled = isSubmitting || !(isValid && isDirty) || !cart.items.length;

  if (!visible) {
    return null;
  }

  return (
    <ButtonToolbar>
      <Button variant="contained" type="submit" color="primary" disabled={disabled}>
        <FormattedMessage id={`form.buttons.${submit}`} />
      </Button>
    </ButtonToolbar>
  );
};
