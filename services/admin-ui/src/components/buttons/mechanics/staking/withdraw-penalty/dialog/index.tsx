import { FC, useEffect, useState } from "react";
import { Contract } from "ethers";
import { Web3ContextType, useWeb3React } from "@web3-react/core";
import { ListItemText } from "@mui/material";
import { PriceChange } from "@mui/icons-material";

import { ProgressOverlay } from "@gemunion/mui-page-layout";
import { ConfirmationDialog } from "@gemunion/mui-dialog-confirmation";
import { useMetamask } from "@gemunion/react-hooks-eth";
import { useApiCall } from "@gemunion/react-hooks";
import { formatEther } from "@framework/exchange";
import { ListAction, ListActions, StyledListItem, StyledListWrapper } from "@framework/styled";
import type { IAssetComponent, IStakingPenalty } from "@framework/types";
import { TokenType } from "@framework/types";

import withdrawBalanceReentrancyStakingRewardABI from "@framework/abis/withdrawBalance/ReentrancyStakingReward.json";
import { useCheckPermissions } from "../../../../../../utils/use-check-permissions";

export interface IStakingWithdrawPenaltyDialogProps {
  open: boolean;
  onCancel: () => void;
  onConfirm: () => void;
  data: { id: number; address: string };
}

export const StakingWithdrawPenaltyDialog: FC<IStakingWithdrawPenaltyDialogProps> = props => {
  const { data, open, ...rest } = props;

  const [rows, setRows] = useState<Array<IAssetComponent>>([]);

  const [hasAccess, setHasAccess] = useState(false);

  const { account = "" } = useWeb3React();

  const { checkPermissions } = useCheckPermissions();

  const { fn, isLoading } = useApiCall(
    async api => {
      return api.fetchJson({
        url: `/staking/penalty/${data.id}`,
      });
    },
    { success: false },
  );

  const metaWithdrawPenalty = useMetamask((values: IAssetComponent, web3Context: Web3ContextType) => {
    const contract = new Contract(
      data.address,
      withdrawBalanceReentrancyStakingRewardABI,
      web3Context.provider?.getSigner(),
    );

    return contract.withdrawBalance({
      tokenType: Object.keys(TokenType).indexOf(values.tokenType),
      token: values.contract?.address,
      tokenId:
        values.tokenType === TokenType.ERC721 || values.tokenType === TokenType.ERC998
          ? values.token!.tokenId
          : values.templateId, // must match with staking.penalties[item.token][item.tokenId];
      amount: 0, // whatever
    }) as Promise<any>;
  });

  const handleWithdraw = (values: IAssetComponent): (() => Promise<void>) => {
    return async () => {
      return metaWithdrawPenalty(values);
    };
  };

  useEffect(() => {
    if (open) {
      void fn().then((res: IStakingPenalty | null) => {
        if (res && res.penalty) {
          setRows(res.penalty.components);
        }
        // setRows(rows);
      });
    }
  }, [open]);

  useEffect(() => {
    const address = rows[0].contract?.address;
    if (account && address) {
      void checkPermissions({
        account,
        address,
      })
        .then((json: { hasRole: boolean }) => {
          setHasAccess(json?.hasRole);
        })
        .catch(console.error);
    }
  }, [rows, account]);

  return (
    <ConfirmationDialog
      message="dialogs.withdrawPenalty"
      data-testid="StakingWithdrawPenaltyDialog"
      open={open}
      {...rest}
    >
      <ProgressOverlay isLoading={isLoading}>
        <StyledListWrapper count={rows.length} isLoading={isLoading}>
          {rows.map(comp => (
            <StyledListItem key={comp.id}>
              <ListItemText sx={{ width: 0.6 }}>{`${comp.template!.title} ${
                comp.token ? ` #${comp.token.tokenId}` : ""
              }`}</ListItemText>
              <ListItemText>{formatEther(comp.amount, comp.contract!.decimals, comp.contract!.symbol)}</ListItemText>
              <ListActions>
                <ListAction
                  disabled={!hasAccess}
                  onClick={handleWithdraw(comp)}
                  message="form.buttons.withdraw"
                  icon={PriceChange}
                />
              </ListActions>
            </StyledListItem>
          ))}
        </StyledListWrapper>
      </ProgressOverlay>
    </ConfirmationDialog>
  );
};
