import { FC, useEffect, useState } from "react";
import { FormattedMessage } from "react-intl";
import { ListItemText, ListSubheader } from "@mui/material";

import { ProgressOverlay } from "@gemunion/mui-page-layout";
import { ConfirmationDialog } from "@gemunion/mui-dialog-confirmation";
import { useApiCall } from "@gemunion/react-hooks";
import { formatEther } from "@framework/exchange";
import { ListActions, StyledListItem, StyledListWrapper } from "@framework/styled";
import type { IContract, IToken } from "@framework/types";

import { TopUpButton } from "../../../../common";

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
        <StyledListWrapper
          count={rows.length}
          isLoading={isLoading}
          subheader={
            <ListSubheader disableGutters>
              <StyledListItem>
                <ListItemText sx={{ width: 0.27 }}>
                  <FormattedMessage id="dialogs.checkBalance.token" />
                </ListItemText>
                <ListItemText sx={{ width: 0.27 }}>
                  <FormattedMessage id="dialogs.checkBalance.stakeBalance" />
                </ListItemText>
                <ListItemText sx={{ width: 0.24 }}>
                  <FormattedMessage id="dialogs.checkBalance.depAmount" />
                </ListItemText>
              </StyledListItem>
            </ListSubheader>
          }
        >
          {rows.map((bal, idx) => (
            <StyledListItem key={idx}>
              <ListItemText sx={{ width: 0.3 }}>{bal?.token ? bal.token.template?.title : ""}</ListItemText>
              <ListItemText sx={{ width: 0.2 }}>
                {bal?.token
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
                {bal?.token
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
            </StyledListItem>
          ))}
        </StyledListWrapper>
      </ProgressOverlay>
    </ConfirmationDialog>
  );
};
