import { FC, useEffect, useState } from "react";
import { List, ListItemText } from "@mui/material";

import type { IPaginationResult } from "@gemunion/types-collection";
import { ConfirmationDialog } from "@gemunion/mui-dialog-confirmation";
import { useApiCall } from "@gemunion/react-hooks";
import { ProgressOverlay } from "@gemunion/mui-page-layout";
import { ListActions, StyledListItem } from "@framework/styled";
import type { IBalance, IContract } from "@framework/types";

import { VestingReleasableButton, VestingReleaseButton } from "../../../../../components/buttons";
import { formatEther } from "../../../../../utils/money";

export interface IBalanceWithdrawDialogProps {
  open: boolean;
  onCancel: () => void;
  onConfirm: () => void;
  initialValues: IContract;
}

export const BalanceWithdrawDialog: FC<IBalanceWithdrawDialogProps> = props => {
  const { initialValues, ...rest } = props;

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
    <ConfirmationDialog message={"dialogs.withdraw"} {...rest}>
      <ProgressOverlay isLoading={isLoading}>
        <List>
          {rows.map(row => (
            <StyledListItem key={row.id}>
              <ListItemText sx={{ width: 0.6 }}>{row.token?.template?.contract?.title}</ListItemText>
              <ListItemText sx={{ width: 0.4 }}>
                {formatEther(
                  row.amount.toString(),
                  row.token?.template?.contract?.decimals,
                  row.token?.template?.contract?.symbol,
                )}
              </ListItemText>
              <ListActions>
                <VestingReleasableButton balance={row} />
                <VestingReleaseButton balance={row} disabled={row.amount === "0"} />
              </ListActions>
            </StyledListItem>
          ))}
        </List>
      </ProgressOverlay>
    </ConfirmationDialog>
  );
};
