import { FC, useEffect, useState } from "react";
import { List, ListItem, ListItemText } from "@mui/material";

import type { IPaginationResult } from "@gemunion/types-collection";
import { ConfirmationDialog } from "@gemunion/mui-dialog-confirmation";
import { useApiCall } from "@gemunion/react-hooks";
import { ProgressOverlay } from "@gemunion/mui-page-layout";
import type { IBalance, IToken } from "@framework/types";

import { formatEther } from "../../../../../utils/money";

export interface IBalanceWithdrawDialogProps {
  open: boolean;
  onCancel: () => void;
  onConfirm: () => void;
  initialValues: IToken;
}

export const BalanceWithdrawDialog: FC<IBalanceWithdrawDialogProps> = props => {
  const { initialValues, ...rest } = props;

  const [rows, setRows] = useState<Array<IBalance>>([]);

  const { fn, isLoading } = useApiCall(
    api => {
      return api.fetchJson({
        url: "/balances",
        data: {
          targetIds: [initialValues.id],
          accounts: [initialValues.template!.contract!.address],
        },
      });
    },
    { success: false },
  );

  useEffect(() => {
    if (!initialValues.template?.contract?.address) {
      return;
    }

    setRows([]);
    void fn().then((json: IPaginationResult<IBalance>) => {
      setRows(json.rows);
    });
  }, [initialValues.id, initialValues.template?.contract?.address]);

  return (
    <ConfirmationDialog message={"dialogs.withdraw"} {...rest}>
      <ProgressOverlay isLoading={isLoading}>
        <List>
          {rows.map(row => (
            <ListItem key={row.id}>
              <ListItemText sx={{ width: 0.6 }}>{row.token?.template?.title}</ListItemText>
              <ListItemText sx={{ width: 0.4 }}>
                {formatEther(
                  row.amount.toString(),
                  row.token?.template?.contract?.decimals,
                  row.token?.template?.contract?.symbol,
                )}
              </ListItemText>
            </ListItem>
          ))}
        </List>
      </ProgressOverlay>
    </ConfirmationDialog>
  );
};
