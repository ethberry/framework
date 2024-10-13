import { FC, useEffect, useState } from "react";
import { ListItemText } from "@mui/material";

import type { IPaginationResult } from "@ethberry/types-collection";
import { ConfirmationDialog } from "@ethberry/mui-dialog-confirmation";
import { useApiCall } from "@ethberry/react-hooks";
import { ProgressOverlay } from "@ethberry/mui-page-layout";
import { formatEther } from "@framework/exchange";
import { ListActions, StyledListItem, StyledListWrapper } from "@framework/styled";
import type { IBalance, IContract } from "@framework/types";

import { VestingReleasableButton, VestingReleaseButton } from "../../../../../../components/buttons";

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
    <ConfirmationDialog message="dialogs.withdraw" {...rest}>
      <ProgressOverlay isLoading={isLoading}>
        <StyledListWrapper count={rows.length} isLoading={isLoading}>
          {rows.map(row => (
            <StyledListItem key={row.id}>
              <ListItemText sx={{ width: 0.6 }}>{row.token?.template?.contract?.title}</ListItemText>
              <ListItemText sx={{ width: 0.4 }}>
                {formatEther(
                  row.amount,
                  row.token?.template?.contract?.decimals,
                  row.token?.template?.contract?.symbol,
                )}
              </ListItemText>
              <ListActions>
                <VestingReleasableButton balance={row} />
                <VestingReleaseButton balance={row} />
              </ListActions>
            </StyledListItem>
          ))}
        </StyledListWrapper>
      </ProgressOverlay>
    </ConfirmationDialog>
  );
};
