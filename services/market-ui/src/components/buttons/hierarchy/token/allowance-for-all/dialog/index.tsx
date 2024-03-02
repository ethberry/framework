import { FC } from "react";
import { FormattedMessage } from "react-intl";

import { Alert } from "@mui/material";

import { FormDialog } from "@gemunion/mui-dialog-form";
// import { validationSchema } from "./validation";

export interface IAllowanceForAllDto {
  amount: string;
  decimals: number;
}

export interface IAllowanceForAllDialogProps {
  open: boolean;
  onCancel: () => void;
  onConfirm: (values: IAllowanceForAllDto, form: any) => Promise<void>;
}

export const AllowanceForAllDialog: FC<IAllowanceForAllDialogProps> = props => {
  const { ...rest } = props;

  return (
    <FormDialog
      initialValues={{}}
      // validationSchema={validationSchema}
      message="dialogs.allowance"
      testId="AllowanceForm"
      disabled={false}
      {...rest}
    >
      <Alert severity="warning">
        <FormattedMessage id="alert.allowanceWarning" />
      </Alert>
    </FormDialog>
  );
};
