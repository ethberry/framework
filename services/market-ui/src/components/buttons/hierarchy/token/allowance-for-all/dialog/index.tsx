import { FC } from "react";
import { FormattedMessage } from "react-intl";
import { Alert } from "@mui/material";

import type { IContract } from "@framework/types";
import { FormDialog } from "@gemunion/mui-dialog-form";
import { InputType } from "@gemunion/types-collection";

import { AllowanceContractInput } from "../../../../../inputs/allowance-contract";
import { validationSchema } from "./validation";

export interface IAllowanceForAllDto {
  contractId: number | InputType;
  contract: Partial<IContract>;
}

export interface IAllowanceForAllDialogProps {
  open: boolean;
  onCancel: () => void;
  onConfirm: (values: IAllowanceForAllDto, form: any) => Promise<void>;
  initialValues: IAllowanceForAllDto;
}

export const AllowanceForAllDialog: FC<IAllowanceForAllDialogProps> = props => {
  const { initialValues, ...rest } = props;

  return (
    <FormDialog
      initialValues={initialValues}
      validationSchema={validationSchema}
      message="dialogs.allowance"
      testId="AllowanceForm"
      disabled={false}
      {...rest}
    >
      <Alert severity="warning">
        <FormattedMessage id="alert.allowanceWarning" />
      </Alert>
      <AllowanceContractInput name="contractId" />
    </FormDialog>
  );
};
