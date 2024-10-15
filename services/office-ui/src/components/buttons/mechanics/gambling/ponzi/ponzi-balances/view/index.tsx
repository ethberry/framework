import { FC, useEffect, useState } from "react";
import { Contract } from "ethers";
import { Web3ContextType } from "@web3-react/core";
import { ListItemText } from "@mui/material";
import { CurrencyExchange } from "@mui/icons-material";

import { ProgressOverlay } from "@ethberry/mui-page-layout";
import { ConfirmationDialog } from "@ethberry/mui-dialog-confirmation";
import { useMetamask } from "@ethberry/react-hooks-eth";
import { useApiCall } from "@ethberry/react-hooks";
import { formatEther } from "@framework/exchange";
import { ListAction, ListActions, StyledListItem, StyledListWrapper } from "@framework/styled";
import type { IBalance } from "@framework/types";

import withdrawTokenPonziABI from "@framework/abis/json/Ponzi/withdrawToken.json";

import { emptyBalance } from "../../../../../../common/interfaces";
import { AmountDialog, IAmountDialogDto } from "../amount-dialog";

export interface IPonziBalanceDialogProps {
  open: boolean;
  onCancel: () => void;
  onConfirm: () => void;
  data: { address: string };
}

export const PonziBalanceDialog: FC<IPonziBalanceDialogProps> = props => {
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
    const contract = new Contract(data.address, withdrawTokenPonziABI, web3Context.provider?.getSigner());
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
    <ConfirmationDialog message="dialogs.ponziBalance" data-testid="PonziBalanceDialog" {...rest}>
      <ProgressOverlay isLoading={isLoading}>
        <StyledListWrapper count={rows.length} isLoading={isLoading}>
          {rows.map(balance => (
            <StyledListItem key={balance.id}>
              <ListItemText sx={{ width: 0.6 }}>{balance.token!.template!.title}</ListItemText>
              <ListItemText>
                {formatEther(
                  balance.amount,
                  balance.token!.template!.contract!.decimals,
                  balance.token!.template!.contract!.symbol,
                )}
              </ListItemText>
              <ListActions>
                <ListAction
                  onClick={handleSetAmount(balance)}
                  icon={CurrencyExchange}
                  message="form.buttons.setAmount"
                />
              </ListActions>
            </StyledListItem>
          ))}
        </StyledListWrapper>
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
