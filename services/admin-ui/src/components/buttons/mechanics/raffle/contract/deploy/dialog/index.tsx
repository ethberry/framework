import { FC } from "react";
import { Alert, Typography } from "@mui/material";
import { FormattedMessage } from "react-intl";

import { FormDialog } from "@gemunion/mui-dialog-form";

export interface IRaffleContractDeployDialogProps {
  open: boolean;
  onCancel: () => void;
  onConfirm: (values: any, form?: any) => Promise<void>;
}

export const RaffleContractDeployDialog: FC<IRaffleContractDeployDialogProps> = props => {
  const fixedValues: Record<string, any> = {};

  return (
    <FormDialog initialValues={fixedValues} message="dialogs.deploy" testId="RaffleContractDeployForm" {...props}>
      <Alert severity="warning" sx={{ mt: 2 }}>
        <FormattedMessage id="alert.minterRole" />
      </Alert>
      <Typography>This contract has no options, you can click `OK` to continue</Typography>
    </FormDialog>
  );
};
