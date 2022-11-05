import { FC } from "react";
import { FormattedMessage } from "react-intl";
import { BigNumber } from "ethers";
import { Typography } from "@mui/material";

import { FormDialog } from "@gemunion/mui-dialog-form";

import { IBalance } from "@framework/types";
import { PayeeInput } from "../../../../components/inputs/payee";
import { WithdrawInfo } from "./withdraw-info";
import { formatEther } from "../../../../utils/money";

export interface IBalanceWithdrawDto {
  balance: IBalance;
  payee: string;
}

export interface IBalanceWithdrawDialogProps {
  open: boolean;
  onCancel: () => void;
  onConfirm: (values: IBalanceWithdrawDto, form: any) => Promise<void>;
  initialValues: IBalanceWithdrawDto;
}

export const BalanceWithdrawDialog: FC<IBalanceWithdrawDialogProps> = props => {
  const { initialValues, ...rest } = props;
  const { balance, payee } = initialValues;
  const fixedValues = {
    balance,
    payee,
  };
  const { account, token, amount } = balance;

  return (
    <FormDialog initialValues={fixedValues} message={"dialogs.withdraw"} testId="BalanceWithdrawForm" {...rest}>
      <Typography variant={"inherit"}>
        <FormattedMessage id="pages.wallet.withdraw.dialog" />
      </Typography>
      <Typography variant={"h6"}>{account}</Typography>
      <Typography variant={"inherit"}>
        <FormattedMessage id="pages.wallet.withdraw.token" />
      </Typography>
      <Typography variant={"h6"}>{token!.template?.title}</Typography>
      <Typography variant={"inherit"}>
        <FormattedMessage id="pages.wallet.withdraw.total" />
      </Typography>
      <Typography variant={"h6"}>
        {amount
          ? formatEther(
              BigNumber.from(amount).toString(),
              token!.template!.contract!.decimals,
              token!.template!.contract!.symbol,
            )
          : 0}
      </Typography>
      <PayeeInput name="payee" controller="wallet/payees" />
      <WithdrawInfo amount={amount} token={token!} />
    </FormDialog>
  );
};
