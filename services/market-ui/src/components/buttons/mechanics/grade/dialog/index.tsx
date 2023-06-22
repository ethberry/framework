import { FC } from "react";

import { FormDialog } from "@gemunion/mui-dialog-form";

import { validationSchema } from "./validation";
import { AttributeInput } from "./attribute-input";

export interface IUpgradeDto {
  attribute: string;
  contractId: number;
}

export interface IAmountDialogProps {
  open: boolean;
  onCancel: () => void;
  onConfirm: (values: IUpgradeDto, form: any) => Promise<void>;
  initialValues: IUpgradeDto;
}

export const UpgradeDialog: FC<IAmountDialogProps> = props => {
  const { initialValues, ...rest } = props;

  const { attribute, contractId } = initialValues;
  const fixedValues = { attribute };

  return (
    <FormDialog
      initialValues={fixedValues}
      validationSchema={validationSchema}
      message="dialogs.amount"
      testId="AmountForm"
      {...rest}
    >
      <AttributeInput
        name="gradeId"
        data={{
          contractId,
        }}
      />
    </FormDialog>
  );
};
