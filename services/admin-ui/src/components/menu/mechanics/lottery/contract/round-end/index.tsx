import { FC } from "react";
import { Web3ContextType } from "@web3-react/core";
import { ListItemIcon, MenuItem, Typography } from "@mui/material";
import { StopCircleOutlined } from "@mui/icons-material";
import { FormattedMessage } from "react-intl";
import { Contract } from "ethers";

import { useMetamask } from "@gemunion/react-hooks-eth";
import type { IContract } from "@framework/types";

import LotteryEndRoundABI from "../../../../../../abis/mechanics/lottery/round/end/endRound.abi.json";

export interface ILotteryRoundEndMenuItemProps {
  contract: IContract;
}

export const LotteryRoundEndMenuItem: FC<ILotteryRoundEndMenuItemProps> = props => {
  const {
    contract: { address },
  } = props;

  const metaFn = useMetamask((web3Context: Web3ContextType) => {
    const contract = new Contract(address, LotteryEndRoundABI, web3Context.provider?.getSigner());
    return contract.endRound() as Promise<void>;
  });

  const handleEndRound = () => {
    return metaFn();
  };

  return (
    <MenuItem onClick={handleEndRound} data-testid="LotteryRoundEndButton">
      <ListItemIcon>
        <StopCircleOutlined fontSize="small" />
      </ListItemIcon>
      <Typography variant="inherit">
        <FormattedMessage id="pages.lottery.rounds.end" />
      </Typography>
    </MenuItem>
  );
};
