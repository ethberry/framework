import { FC, useEffect, useState } from "react";
import { List, ListItem, ListItemSecondaryAction, ListItemText } from "@mui/material";

import type { IPaginationResult } from "@gemunion/types-collection";
import { ConfirmationDialog } from "@gemunion/mui-dialog-confirmation";
import { useApiCall } from "@gemunion/react-hooks";
import { ProgressOverlay } from "@gemunion/mui-page-layout";
import type { IBalance, IContract } from "@framework/types";

import { ExchangeReleasableButton, ExchangeReleaseButton } from "../../../../../components/buttons";

export interface IBalanceWithdrawDialogProps {
  open: boolean;
  onCancel: () => void;
  onConfirm: () => void;
  initialValues: IContract;
}

export const BalanceWithdrawDialog: FC<IBalanceWithdrawDialogProps> = props => {
  const { initialValues, ...rest } = props;
  console.log("BalanceWithdrawDialoginitialValues", initialValues);
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
          {rows.map((row, i) => (
            <ListItem key={i}>
              <ListItemText>
                {row.token!.template!.contract!.title}
                {row.token!.template!.contract!.contractType === "ERC1155" ? ` - ${row.token!.template!.title}` : ""}
              </ListItemText>
              <ListItemSecondaryAction>
                <ExchangeReleasableButton balance={row} />
                <ExchangeReleaseButton balance={row} />
              </ListItemSecondaryAction>
            </ListItem>
          ))}
        </List>
      </ProgressOverlay>
    </ConfirmationDialog>
  );
};
