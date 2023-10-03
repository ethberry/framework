import { FC } from "react";

import { IParameter } from "@framework/types";
import { FormDialog } from "@gemunion/mui-dialog-form";

import { ParameterInput } from "../../../../components/inputs/parameter";
import { validationSchema } from "./validation";

export interface IEditParameterDialogProps {
  open: boolean;
  onCancel: (form?: any) => void;
  onConfirm: (values: Partial<IParameter>, form: any) => Promise<void>;
  initialValues: IParameter;
  parameters: IParameter[];
}

export const EditParameterDialog: FC<IEditParameterDialogProps> = props => {
  const { initialValues, parameters, ...rest } = props;

  const { id, parameterName, parameterType, parameterValue, parameterMinValue, parameterMaxValue } = initialValues;
  const fixedValues = {
    id,
    parameterName,
    parameterType,
    parameterValue,
    parameterMinValue,
    parameterMaxValue,
  };

  const message = id ? "dialogs.edit" : "dialogs.create";

  return (
    <FormDialog initialValues={fixedValues} validationSchema={validationSchema} message={message} {...rest}>
      <ParameterInput parameters={parameters} />
    </FormDialog>
  );
};
