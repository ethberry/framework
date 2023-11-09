import { FC, useEffect, useState } from "react";
import { FormattedMessage } from "react-intl";
import { List, ListItem, ListItemText, ListSubheader, Typography } from "@mui/material";

import { ProgressOverlay } from "@gemunion/mui-page-layout";
import { ConfirmationDialog } from "@gemunion/mui-dialog-confirmation";
import { useApiCall } from "@gemunion/react-hooks";
import { ListActions } from "@framework/mui-lists";
import type { IContract, IToken } from "@framework/types";
import { formatEther } from "../../../../../../utils/money";
import { TopUpButton } from "../../../common/top-up";

export interface IStakingDepositBalanceCheck {
  token: IToken;
  depositAmount: bigint;
  stakingBalance: bigint;
  topUp: boolean;
}

export interface IStakingCheckBalanceDialogProps {
  open: boolean;
  onCancel: () => void;
  onConfirm: () => void;
  data: { id: number; address: string; contract: IContract };
}

export const StakingCheckBalanceDialog: FC<IStakingCheckBalanceDialogProps> = props => {
  const { data, open, ...rest } = props;

  const [rows, setRows] = useState<Array<IStakingDepositBalanceCheck | null>>([]);

  const { fn, isLoading } = useApiCall(
    async api => {
      return api.fetchJson({
        url: `/staking/contracts/balance/${data.id}`,
      });
    },
    { success: false },
  );

  useEffect(() => {
    if (open) {
      void fn().then((res: Array<IStakingDepositBalanceCheck | null>) => {
        if (res) {
          setRows(res);
        }
      });
    }
  }, [open]);

  return (
    <ConfirmationDialog
      message="dialogs.checkBalance.title"
      data-testid="StakingCheckBalanceDialog"
      open={open}
      {...rest}
    >
      <ProgressOverlay isLoading={isLoading}>
        {rows.length ? (
          <List
            subheader={
              <ListSubheader>
                <ListItem>
                  <ListItemText sx={{ width: 0.25 }}>
                    <FormattedMessage id="dialogs.checkBalance.token" />
                  </ListItemText>
                  <ListItemText sx={{ width: 0.25 }}>
                    <FormattedMessage id="dialogs.checkBalance.stakeBalance" />
                  </ListItemText>
                  <ListItemText sx={{ width: 0.25 }}>
                    <FormattedMessage id="dialogs.checkBalance.depAmount" />
                  </ListItemText>
                </ListItem>
              </ListSubheader>
            }
          >
            {rows.map((bal, idx) => (
              <ListItem key={idx}>
                <ListItemText sx={{ width: 0.3 }}>{bal && bal.token ? bal.token.template?.title : ""}</ListItemText>
                <ListItemText sx={{ width: 0.2 }}>
                  {bal && bal.token
                    ? formatEther(
                        bal.stakingBalance.toString(),
                        bal.token?.template?.contract!.decimals,
                        bal.token?.template?.contract!.symbol,
                      )
                    : ""}
                </ListItemText>
                <ListItemText sx={{ width: 0.06 }}>
                  {bal && BigInt(bal.stakingBalance) > BigInt(bal.depositAmount) ? ">" : "<"}
                </ListItemText>
                <ListItemText sx={{ width: 0.2 }}>
                  {bal && bal.token
                    ? formatEther(
                        bal.depositAmount.toString(),
                        bal.token?.template?.contract!.decimals,
                        bal.token?.template?.contract!.symbol,
                      )
                    : ""}
                </ListItemText>
                <ListActions>
                  <TopUpButton contract={data.contract} disabled={bal ? !bal.topUp : true} />
                </ListActions>
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
