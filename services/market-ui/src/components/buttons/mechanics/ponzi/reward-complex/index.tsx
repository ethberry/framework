import { FC, Fragment, useState } from "react";
import { useIntl } from "react-intl";
import { IconButton, Tooltip } from "@mui/material";
import { Redeem } from "@mui/icons-material";
import { Contract } from "ethers";
import { Web3ContextType } from "@web3-react/core";

import { IPonziDeposit, PonziDepositStatus } from "@framework/types";
import { useMetamask } from "@gemunion/react-hooks-eth";

import ReceiveRewardABI from "../../../../../abis/mechanics/common/reward/receiveReward.abi.json";
import { DepositRewardDialog, IDepositRewardDto } from "../../../../dialogs/reward-dialog";

export interface IPonziRewardComplexButtonProps {
  stake: IPonziDeposit;
}

export const PonziRewardComplexButton: FC<IPonziRewardComplexButtonProps> = props => {
  const { stake } = props;

  const [isRewardDialogOpen, setIsRewardDialogOpen] = useState(false);

  const { formatMessage } = useIntl();

  const metaFn = useMetamask(async (stake: IPonziDeposit, values: IDepositRewardDto, web3Context: Web3ContextType) => {
    const contract = new Contract(
      stake.ponziRule!.contract.address,
      ReceiveRewardABI,
      web3Context.provider?.getSigner(),
    );
    // https://ethereum.stackexchange.com/questions/132850/incorrect-gaslimit-estimation-for-transaction
    const estGas = await contract.estimateGas.receiveReward(stake.externalId, values.withdrawDeposit, false);
    return contract.receiveReward(stake.externalId, values.withdrawDeposit, false, {
      gasLimit: estGas.add(estGas.div(100).mul(10)),
    }) as Promise<void>;
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

  if (stake.ponziDepositStatus !== PonziDepositStatus.ACTIVE) {
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
          rule: stake.ponziRule!,
          withdrawDeposit: false,
        }}
      />
    </Fragment>
  );
};