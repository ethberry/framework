import { FC } from "react";
import { AlertColor } from "@mui/material";
import { FormattedMessage } from "react-intl";
import { FieldValues, useWatch } from "react-hook-form";

import { StyledAlert } from "./styled";

export interface IFormAlertProps {
  message: string;
  severity?: AlertColor;
  condition: (value: FieldValues) => boolean;
}

export const FormAlert: FC<IFormAlertProps> = props => {
  const { condition, message, severity = "warning" } = props;

  const values = useWatch();

  if (!condition(values)) {
    return null;
  }

  return (
    <StyledAlert severity={severity}>
      <FormattedMessage id={message} />
    </StyledAlert>
  );
};
