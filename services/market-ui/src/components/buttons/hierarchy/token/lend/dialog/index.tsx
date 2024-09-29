import { FC } from "react";

import { FormDialog } from "@ethberry/mui-dialog-form";
import { TextInput } from "@ethberry/mui-inputs-core";
import { EntityInput } from "@ethberry/mui-inputs-entity";
import { DateTimeInput } from "@ethberry/mui-inputs-picker";

import { validationSchema } from "./validation";

export interface ILendDto {
  account: string;
  expires: string;
  contractId: number;
  rentRule: number;
}

export interface ILendDialogProps {
  open: boolean;
  onCancel: () => void;
  onConfirm: (values: ILendDto, form: any) => Promise<void>;
  initialValues: ILendDto;
  message: string;
  testId: string;
}

export const LendDialog: FC<ILendDialogProps> = props => {
  const { initialValues, message, testId = "LendDialogForm", ...rest } = props;
  const { contractId } = initialValues;
  return (
    <FormDialog
      initialValues={initialValues}
      validationSchema={validationSchema}
      message={message}
      testId={testId}
      {...rest}
    >
      <TextInput name="account" />
      <DateTimeInput name="expires" />
      <EntityInput name="rentRule" controller="rent" data={{ contractId }} />
    </FormDialog>
  );
};
