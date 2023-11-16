import { FC, useEffect, useState } from "react";
import { Contract } from "ethers";
import { Web3ContextType } from "@web3-react/core";
import { FormattedMessage } from "react-intl";
import { List, ListItemText, Typography } from "@mui/material";
import { CurrencyExchange } from "@mui/icons-material";

import { useUser } from "@gemunion/provider-user";
import { ProgressOverlay } from "@gemunion/mui-page-layout";
import { ConfirmationDialog } from "@gemunion/mui-dialog-confirmation";
import { useMetamask } from "@gemunion/react-hooks-eth";
import { useApiCall } from "@gemunion/react-hooks";
import { ListAction, ListActions, StyledListItem } from "@framework/styled";
import type { IContract, IBalance, IUser } from "@framework/types";
import { TokenType } from "@framework/types";

import PaymentSplitterReleaseABI from "../../../../../../abis/mechanics/payment-splitter/release/releasePaymentSplitter.abi.json";

import { formatEther } from "../../../../../../utils/money";

export interface IPaymentSplitterBalanceDialogProps {
  open: boolean;
  onCancel: () => void;
  onConfirm: () => void;
  data: { contract: IContract };
}

export const PaymentSplitterBalanceDialog: FC<IPaymentSplitterBalanceDialogProps> = props => {
  const { data, ...rest } = props;
  const { address, parameters } = data.contract;
  const { payees, shares } = parameters as { payees: Array<string>; shares: Array<string> };
  const { profile } = useUser<IUser>();
  const { wallet } = profile;
  const currentShare = shares[payees.indexOf(wallet.toLowerCase())];
  const total = shares.reduce((partialSum, a) => partialSum + Number(a), 0);
  const [rows, setRows] = useState<Array<IBalance>>([]);

  const { fn, isLoading } = useApiCall(
    async api => {
      return api.fetchJson({
        url: `/balances/${address}`,
      });
    },
    { success: false },
  );

  const metaWithdraw = useMetamask(async (values: IBalance, web3Context: Web3ContextType) => {
    const contract = new Contract(address, PaymentSplitterReleaseABI, web3Context.provider?.getSigner());

    const tokenType = values.token!.template!.contract!.contractType;
    const token = values.token!.template!.contract!.address;

    if (tokenType === TokenType.NATIVE) {
      return contract["release(address)"](wallet) as Promise<void>;
    } else if (tokenType === TokenType.ERC20) {
      return contract["release(address,address)"](token, wallet) as Promise<void>;
    } else {
      throw new Error("unsupported token type");
    }
  });

  useEffect(() => {
    void fn().then((rows: Array<IBalance>) => {
      setRows(rows);
    });
  }, []);

  const handleRelease = (values: IBalance): (() => Promise<void>) => {
    return async () => {
      return metaWithdraw(values);
    };
  };

  return (
    <ConfirmationDialog message="dialogs.paymentSplitterBalances" data-testid="PaymentSplitterBalanceDialog" {...rest}>
      {rows.length ? (
        <Typography variant="body2">
          <FormattedMessage id="dialogs.paymentSplitterWallet" values={{ wallet }} />
        </Typography>
      ) : null}
      {rows.length ? (
        <Typography variant="body2">
          <FormattedMessage id="dialogs.paymentSplitterShares" values={{ currentShare, total }} />
        </Typography>
      ) : null}
      <ProgressOverlay isLoading={isLoading}>
        {rows.length ? (
          <List>
            {rows.map(balance => (
              <StyledListItem key={balance.id}>
                <ListItemText sx={{ width: 0.6 }}>{balance.token!.template!.title}</ListItemText>
                <ListItemText>
                  {formatEther(
                    balance.amount,
                    // getReleasableBalance(balance),
                    balance.token!.template!.contract!.decimals,
                    balance.token!.template!.contract!.symbol,
                  )}
                </ListItemText>
                <ListActions>
                  <ListAction
                    onClick={handleRelease(balance)}
                    icon={CurrencyExchange}
                    message="form.buttons.setAmount"
                  />
                </ListActions>
              </StyledListItem>
            ))}
          </List>
        ) : (
          <Typography>
            <FormattedMessage id="messages.empty-list" />
          </Typography>
        )}
      </ProgressOverlay>
    </ConfirmationDialog>
  );
};
