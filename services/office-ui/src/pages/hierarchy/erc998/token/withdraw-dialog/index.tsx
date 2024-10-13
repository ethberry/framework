import { FC, useEffect, useState } from "react";
import { ListItemText } from "@mui/material";

import type { IPaginationResult } from "@ethberry/types-collection";
import { ConfirmationDialog } from "@ethberry/mui-dialog-confirmation";
import { useApiCall } from "@ethberry/react-hooks";
import { ProgressOverlay } from "@ethberry/mui-page-layout";
import { formatEther } from "@framework/exchange";
import { StyledListItem, StyledListWrapper } from "@framework/styled";
import type { IBalance, IToken } from "@framework/types";

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
        <StyledListWrapper count={rows.length} isLoading={isLoading}>
          {rows.map(row => (
            <StyledListItem key={row.id}>
              <ListItemText sx={{ width: 0.6 }}>{row.token?.template?.title}</ListItemText>
              <ListItemText sx={{ width: 0.4 }}>
                {formatEther(
                  row.amount,
                  row.token?.template?.contract?.decimals,
                  row.token?.template?.contract?.symbol,
                )}
              </ListItemText>
            </StyledListItem>
          ))}
        </StyledListWrapper>
      </ProgressOverlay>
    </ConfirmationDialog>
  );
};
