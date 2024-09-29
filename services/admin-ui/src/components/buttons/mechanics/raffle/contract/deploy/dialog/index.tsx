import { FC } from "react";
import { Typography } from "@mui/material";
import { FormattedMessage } from "react-intl";

import { FormDialog } from "@ethberry/mui-dialog-form";

import { StyledAlert } from "./styled";

export interface IRaffleContractDeployDialogProps {
  open: boolean;
  onCancel: () => void;
  onConfirm: (values: any, form?: any) => Promise<void>;
}

export const RaffleContractDeployDialog: FC<IRaffleContractDeployDialogProps> = props => {
  const fixedValues: Record<string, any> = {};

  return (
    <FormDialog
      initialValues={fixedValues}
      message="dialogs.deploy"
      testId="RaffleContractDeployForm"
      disabled={false}
      {...props}
    >
      <StyledAlert severity="warning">
        <FormattedMessage id="alert.minterRole" />
      </StyledAlert>
      <StyledAlert severity="warning">
        <FormattedMessage id="alert.randomChainlink" />
      </StyledAlert>
      <Typography>This contract has no options, you can click `OK` to continue</Typography>
    </FormDialog>
  );
};
