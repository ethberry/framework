import { FC } from "react";

import { FormDialog } from "@gemunion/mui-dialog-form";

import { validationSchema } from "./validation";
import { TokenInput } from "./token-input";

export interface IStakingDepositDto {
  tokenId: number;
  templateId: number;
  contractId: number;
  blockchainId: string;
  account: string;
}

export interface IStakingDepositDialogProps {
  open: boolean;
  onCancel: () => void;
  onConfirm: (values: IStakingDepositDto, form?: any) => Promise<void>;
  initialValues: IStakingDepositDto;
}

export const StakingDepositDialog: FC<IStakingDepositDialogProps> = props => {
  const { initialValues, ...rest } = props;

  return (
    <FormDialog
      initialValues={initialValues}
      validationSchema={validationSchema}
      message="dialogs.deposit"
      testId="StakingDepositDialogForm"
      {...rest}
    >
      <TokenInput />
    </FormDialog>
  );
};
