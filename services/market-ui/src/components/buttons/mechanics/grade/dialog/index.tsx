import { FC } from "react";

import { FormDialog } from "@gemunion/mui-dialog-form";

import { validationSchema } from "./validation";
import { AttributeInput } from "./attribute-input";
import { AttributePrice } from "./attribute-price";

export interface IUpgradeDto {
  attribute: string;
  contractId: number;
}

export interface IUpgradeDialogProps {
  open: boolean;
  onCancel: () => void;
  onConfirm: (values: IUpgradeDto, form: any) => Promise<void>;
  initialValues: IUpgradeDto;
}

export const UpgradeDialog: FC<IUpgradeDialogProps> = props => {
  const { initialValues, ...rest } = props;

  const { attribute, contractId } = initialValues;
  const fixedValues = { attribute };

  return (
    <FormDialog
      disabled={false}
      initialValues={fixedValues}
      // validationSchema={validationSchema}
      message="dialogs.grade"
      testId="UpgradeAttributeForm"
      {...rest}
    >
      <AttributePrice />
      <AttributeInput
        name="gradeId"
        data={{
          contractId,
        }}
      />
    </FormDialog>
  );
};
