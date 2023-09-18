import { FC, Fragment, useState } from "react";
import { Redeem } from "@mui/icons-material";
import { Web3ContextType } from "@web3-react/core";
import { Contract } from "ethers";

import { ListAction, ListActionVariant } from "@framework/mui-lists";
import { IPonziDeposit, PonziDepositStatus } from "@framework/types";
import { useMetamask } from "@gemunion/react-hooks-eth";

import ReceiveRewardABI from "../../../../../abis/mechanics/common/reward/receiveReward.abi.json";

import { DepositRewardDialog, IDepositRewardDto } from "../../../../dialogs/reward-dialog";

export interface IPonziRewardComplexButtonProps {
  className?: string;
  disabled?: boolean;
  stake: IPonziDeposit;
  variant?: ListActionVariant;
}

export const PonziRewardComplexButton: FC<IPonziRewardComplexButtonProps> = props => {
  const { className, disabled, stake, variant } = props;

  const [isRewardDialogOpen, setIsRewardDialogOpen] = useState(false);

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
      <ListAction
        onClick={handleReward}
        icon={Redeem}
        message="form.tips.reward"
        className={className}
        dataTestId="StakeRewardButton"
        disabled={disabled}
        variant={variant}
      />
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
