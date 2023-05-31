import { FC, useEffect, useState } from "react";
import { List, ListItem, ListItemSecondaryAction, ListItemText } from "@mui/material";

import type { IPaginationResult } from "@gemunion/types-collection";
import { ConfirmationDialog } from "@gemunion/mui-dialog-confirmation";
import { useApiCall } from "@gemunion/react-hooks";
import { ProgressOverlay } from "@gemunion/mui-page-layout";
import type { IBalance, IContract } from "@framework/types";
import { ModuleType } from "@framework/types";

import {
  BalanceReleasableButton,
  BalanceReleaseButton,
  StakingPenaltyBalanceButton,
  StakingWithdrawButton,
} from "../../../../../components/buttons";
import { formatEther } from "../../../../../utils/money";

export interface IBalanceWithdrawDialogProps {
  open: boolean;
  onCancel: () => void;
  onConfirm: () => void;
  initialValues: IContract;
}

export const BalanceWithdrawDialog: FC<IBalanceWithdrawDialogProps> = props => {
  const { initialValues, ...rest } = props;
  const { contractModule } = initialValues;

  const isStaking = contractModule === ModuleType.STAKING;

  const [rows, setRows] = useState<Array<IBalance>>([]);

  const { fn, isLoading } = useApiCall(
    api => {
      return api.fetchJson({
        url: "/balances",
        data: {
          accounts: [initialValues.address],
        },
      });
    },
    { success: false },
  );

  useEffect(() => {
    if (!initialValues.address) {
      return;
    }

    setRows([]);
    void fn().then((json: IPaginationResult<IBalance>) => {
      setRows(json.rows);
    });
  }, [initialValues.address]);

  return (
    <ConfirmationDialog message={!isStaking ? "dialogs.withdraw" : "dialogs.withdrawStaking"} {...rest}>
      <ProgressOverlay isLoading={isLoading}>
        <List>
          {rows.map((row, i) => (
            <ListItem key={i}>
              <ListItemText sx={{ width: 0.6 }}>{row.token!.template!.contract!.title}</ListItemText>
              <ListItemText sx={{ width: 0.4 }}>
                {formatEther(
                  row.amount.toString(),
                  row.token?.template?.contract?.decimals,
                  row.token?.template?.contract?.symbol,
                )}
              </ListItemText>
              <ListItemSecondaryAction>
                {isStaking ? <StakingPenaltyBalanceButton balance={row} /> : <BalanceReleasableButton balance={row} />}
                {isStaking ? <StakingWithdrawButton balance={row} /> : <BalanceReleaseButton balance={row} />}
              </ListItemSecondaryAction>
            </ListItem>
          ))}
        </List>
      </ProgressOverlay>
    </ConfirmationDialog>
  );
};
