import { FC, Fragment } from "react";
import { Add } from "@mui/icons-material";
import { Contract, utils } from "ethers";

import { useDeploy } from "@gemunion/react-hooks-eth";
import { useUser } from "@gemunion/provider-user";
import { ListAction, ListActionVariant } from "@framework/styled";
import type { IContract, ILotteryContractDeployDto, IUser } from "@framework/types";

import deployLotteryLotteryFactoryFacetABI from "@framework/abis/json/LotteryFactoryFacet/deployLottery.json";

import { LotteryContractDeployDialog } from "./dialog";

export interface ILotteryContractDeployButtonProps {
  className?: string;
  disabled?: boolean;
  variant?: ListActionVariant;
}

export const LotteryContractDeployButton: FC<ILotteryContractDeployButtonProps> = props => {
  const { className, disabled, variant = ListActionVariant.button } = props;

  const { profile } = useUser<IUser>();

  const { isDeployDialogOpen, handleDeployCancel, handleDeployConfirm, handleDeploy } = useDeploy(
    (values: ILotteryContractDeployDto, web3Context, sign, systemContract: IContract) => {
      const nonce = utils.arrayify(sign.nonce);
      const contract = new Contract(
        systemContract.address,
        deployLotteryLotteryFactoryFacetABI,
        web3Context.provider?.getSigner(),
      );

      return contract.deployLottery(
        {
          nonce,
          bytecode: sign.bytecode,
          externalId: profile.id,
        },
        {
          config: {
            timeLagBeforeRelease: values.config.timeLagBeforeRelease,
            commission: values.config.commission,
          },
        },
        sign.signature,
      ) as Promise<void>;
    },
  );

  const onDeployConfirm = (values: Record<string, any>, form: any) => {
    return handleDeployConfirm(
      {
        url: "/contract-manager/lottery",
        method: "POST",
        data: { config: values },
      },
      form,
    );
  };

  return (
    <Fragment>
      <ListAction
        onClick={handleDeploy}
        icon={Add}
        message="form.buttons.deploy"
        className={className}
        dataTestId="LotteryDeployButton"
        disabled={disabled}
        variant={variant}
      />
      <LotteryContractDeployDialog
        onConfirm={onDeployConfirm}
        onCancel={handleDeployCancel}
        open={isDeployDialogOpen}
        initialValues={{
          timeLagBeforeRelease: 60 * 60 * 24 * 30, // 30 days in seconds
          commission: 30, // 30%
        }}
      />
    </Fragment>
  );
};
