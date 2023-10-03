import { FC } from "react";

import { FormDialog } from "@gemunion/mui-dialog-form";
import { TextInput } from "@gemunion/mui-inputs-core";
import { EntityInput } from "@gemunion/mui-inputs-entity";
import { DateTimeInput } from "@gemunion/mui-inputs-picker";

import { validationSchema } from "./validation";
import { RentRuleStatus } from "@framework/types";

export interface ILendDto {
  account: string;
  expires: string;
  contractId: number;
  rentRule: number;
}

export interface ILendDialogProps {
  open: boolean;
  onCancel: (form?: any) => void;
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
      <EntityInput name="rentRule" controller="rent" data={{ contractId, rentStatus: RentRuleStatus.ACTIVE }} />
    </FormDialog>
  );
};
