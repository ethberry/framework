import { FC } from "react";

import { FormDialog } from "@gemunion/mui-dialog-form";

import { validationSchema } from "./validation";
import { IAssetComponent } from "@framework/types";
import { TokenDepositInput } from "../../../../../inputs/deposit-token-input";

export interface IStakingDepositDto {
  // tokenId: number;
  // token: {
  //   tokenId: string;
  // };
  // templateId: number;
  // contractId: number;
  tokenIds: Array<number>;
  deposit: IAssetComponent[];
}

export interface IStakingDepositDialogProps {
  open: boolean;
  onCancel: () => void;
  onConfirm: (values: IStakingDepositDto, form?: any) => Promise<void>;
  initialValues: IStakingDepositDto;
}

export const StakingDepositDialog: FC<IStakingDepositDialogProps> = props => {
  const { initialValues, ...rest } = props;
  // const { deposit } = initialValues;
  return (
    <FormDialog
      initialValues={initialValues}
      validationSchema={validationSchema}
      message="dialogs.deposit"
      testId="StakingDepositDialogForm"
      {...rest}
    >
      <TokenDepositInput />
    </FormDialog>
  );
};
// {deposit.map((dep, i) => (dep.tokenType === TokenType.ERC721 ? <TokenDepositInput key={i} /> : null))}
