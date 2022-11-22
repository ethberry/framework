import { FC, useEffect, useState } from "react";
import { Contract, BigNumber } from "ethers";
import { Web3ContextType } from "@web3-react/core";
import { FormattedMessage } from "react-intl";
import { IconButton, List, ListItem, ListItemSecondaryAction, ListItemText, Typography } from "@mui/material";
import { TransferWithinAStation } from "@mui/icons-material";

import { ProgressOverlay } from "@gemunion/mui-page-layout";
import { ConfirmationDialog } from "@gemunion/mui-dialog-confirmation";
import { useMetamask } from "@gemunion/react-hooks-eth";
import { useApiCall } from "@gemunion/react-hooks";
import type { IBalance } from "@framework/types";

import IPyramidSol from "@framework/core-contracts/artifacts/contracts/Mechanics/Pyramid/Pyramid.sol/Pyramid.json";
import { formatEther } from "../../../../../utils/money";

export interface IPyramidBalanceDialogProps {
  open: boolean;
  onCancel: () => void;
  onConfirm: () => void;
  data: { address: string };
}

export const PyramidBalanceDialog: FC<IPyramidBalanceDialogProps> = props => {
  const { data, ...rest } = props;

  const [rows, setRows] = useState<Array<IBalance>>([]);

  const { fn, isLoading } = useApiCall(
    async api => {
      return api.fetchJson({
        url: `/balances/${data.address}`,
      });
    },
    { success: false },
  );

  const metaWithdraw = useMetamask((values: IBalance, web3Context: Web3ContextType) => {
    const contract = new Contract(data.address, IPyramidSol.abi, web3Context.provider?.getSigner());
    // return contract.withdrawToken(values.token!.template!.contract!.address, values.amount) as Promise<void>;
    return contract.withdrawToken(
      values.token!.template!.contract!.address,
      BigNumber.from(values.amount).sub(1),
    ) as Promise<void>;
  });

  const handleWithdraw = (values: IBalance): (() => Promise<void>) => {
    return async () => {
      return metaWithdraw(values);
    };
  };

  useEffect(() => {
    void fn().then((rows: Array<IBalance>) => {
      setRows(rows);
    });
  }, []);

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
                  <IconButton onClick={handleWithdraw(balance)}>
                    <TransferWithinAStation />
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
    </ConfirmationDialog>
  );
};
