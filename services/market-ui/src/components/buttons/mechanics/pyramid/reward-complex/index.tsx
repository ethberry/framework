import { FC, Fragment, useState } from "react";
import { useIntl } from "react-intl";
import { IconButton, Tooltip } from "@mui/material";
import { Redeem } from "@mui/icons-material";
import { Contract } from "ethers";
import { Web3ContextType } from "@web3-react/core";

import { IPyramidDeposit, PyramidDepositStatus } from "@framework/types";
import { useMetamask } from "@gemunion/react-hooks-eth";
import PyramidSol from "@framework/core-contracts/artifacts/contracts/Mechanics/Pyramid/Pyramid.sol/Pyramid.json";

import { DepositRewardDialog, IDepositRewardDto } from "../../../../dialogs/reward-dialog";

export interface IPyramidRewardComplexButtonProps {
  stake: IPyramidDeposit;
}

export const PyramidRewardComplexButton: FC<IPyramidRewardComplexButtonProps> = props => {
  const { stake } = props;

  const [isRewardDialogOpen, setIsRewardDialogOpen] = useState(false);

  const { formatMessage } = useIntl();

  const metaFn = useMetamask((stake: IPyramidDeposit, values: IDepositRewardDto, web3Context: Web3ContextType) => {
    const contract = new Contract(
      stake.pyramidRule!.contract.address,
      PyramidSol.abi,
      web3Context.provider?.getSigner(),
    );
    return contract.receiveReward(stake.externalId, values.withdrawDeposit, false) as Promise<void>;
  });

  const handleReward = () => {
    setIsRewardDialogOpen(true);
  };

  const handleRewardConfirm = (values: IDepositRewardDto) => {
    return metaFn(stake, values);
  };

  const handleRewardCancel = () => {
    setIsRewardDialogOpen(false);
  };

  if (stake.pyramidDepositStatus !== PyramidDepositStatus.ACTIVE) {
    return null;
  }

  return (
    <Fragment>
      <Tooltip title={formatMessage({ id: "form.tips.reward" })}>
        <IconButton onClick={handleReward} data-testid="StakeRewardButton">
          <Redeem />
        </IconButton>
      </Tooltip>
      <DepositRewardDialog
        onConfirm={handleRewardConfirm}
        onCancel={handleRewardCancel}
        open={isRewardDialogOpen}
        initialValues={{
          rule: stake.pyramidRule!,
          withdrawDeposit: false,
        }}
      />
    </Fragment>
  );
};
