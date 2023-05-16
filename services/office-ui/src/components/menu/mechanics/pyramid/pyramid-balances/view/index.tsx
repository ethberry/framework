import { FC, useEffect, useState } from "react";
import { Contract } from "ethers";
import { Web3ContextType } from "@web3-react/core";
import { FormattedMessage } from "react-intl";
import { IconButton, List, ListItem, ListItemSecondaryAction, ListItemText, Typography } from "@mui/material";
import { CurrencyExchange } from "@mui/icons-material";

import { ProgressOverlay } from "@gemunion/mui-page-layout";
import { ConfirmationDialog } from "@gemunion/mui-dialog-confirmation";
import { useMetamask } from "@gemunion/react-hooks-eth";
import { useApiCall } from "@gemunion/react-hooks";
import type { IBalance } from "@framework/types";

import PyramidWithdrawTokenABI from "../../../../../../abis/components/menu/mechanics/pyramid/pyramid-balances/withdrawToken.abi.json";

import { formatEther } from "../../../../../../utils/money";
import { emptyBalance } from "../../../../../common/interfaces";
import { AmountDialog, IAmountDialogDto } from "../amount-dialog";

export interface IPyramidBalanceDialogProps {
  open: boolean;
  onCancel: () => void;
  onConfirm: () => void;
  data: { address: string };
}

export const PyramidBalanceDialog: FC<IPyramidBalanceDialogProps> = props => {
  const { data, ...rest } = props;

  const [rows, setRows] = useState<Array<IBalance>>([]);
  const [isAmountDialogOpen, setIsAmountDialogOpen] = useState(false);
  const [withdrawBalance, setWithdrawBalance] = useState<IBalance>(emptyBalance);

  const { fn, isLoading } = useApiCall(
    async api => {
      return api.fetchJson({
        url: `/balances/${data.address}`,
      });
    },
    { success: false },
  );

  const metaWithdraw = useMetamask(async (values: IBalance, withdrawAmount: string, web3Context: Web3ContextType) => {
    const contract = new Contract(data.address, PyramidWithdrawTokenABI, web3Context.provider?.getSigner());
    // return contract.withdrawToken(values.token!.template!.contract!.address, values.amount) as Promise<void>;
    const token = values.token!.template!.contract!.address;
    // https://ethereum.stackexchange.com/questions/132850/incorrect-gaslimit-estimation-for-transaction
    const estGas = await contract.estimateGas.withdrawToken(token, withdrawAmount);
    return contract.withdrawToken(token, withdrawAmount, {
      gasLimit: estGas.add(estGas.div(100).mul(10)),
    }) as Promise<void>;
  });

  useEffect(() => {
    void fn().then((rows: Array<IBalance>) => {
      setRows(rows);
    });
  }, []);

  const handleSetAmount = (values: IBalance): (() => void) => {
    return () => {
      setWithdrawBalance(values);
      return setIsAmountDialogOpen(true);
    };
  };

  const handleWithdraw = async (values: IBalance, withdrawAmount: string): Promise<void> => {
    return metaWithdraw(values, withdrawAmount);
  };

  const handleSetAmountCancel = () => {
    setIsAmountDialogOpen(false);
  };

  const handleAmountConfirm = async (values: IAmountDialogDto): Promise<void> => {
    await handleWithdraw(values.balance, values.amount);
    setIsAmountDialogOpen(false);
  };

  return (
    <ConfirmationDialog message="dialogs.pyramidBalance" data-testid="PyramidBalanceDialog" {...rest}>
      <ProgressOverlay isLoading={isLoading}>
        {rows.length ? (
          <List>
            {rows.map((balance, i) => (
              <ListItem key={i}>
                <ListItemText sx={{ width: 0.6 }}>{balance.token!.template!.title}</ListItemText>
                <ListItemText>
                  {formatEther(
                    balance.amount,
                    balance.token!.template!.contract!.decimals,
                    balance.token!.template!.contract!.symbol,
                  )}
                </ListItemText>
                <ListItemSecondaryAction>
                  <IconButton onClick={handleSetAmount(balance)}>
                    <CurrencyExchange />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
            ))}
          </List>
        ) : (
          <Typography>
            <FormattedMessage id="messages.empty-list" />
          </Typography>
        )}
      </ProgressOverlay>
      <AmountDialog
        onCancel={handleSetAmountCancel}
        onConfirm={handleAmountConfirm}
        open={isAmountDialogOpen}
        message="dialogs.setAmount"
        testId="AmountDialogForm"
        initialValues={{
          balance: withdrawBalance,
          amount: withdrawBalance.amount,
        }}
      />
    </ConfirmationDialog>
  );
};
