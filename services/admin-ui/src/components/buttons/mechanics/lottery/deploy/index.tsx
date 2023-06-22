import { FC, Fragment } from "react";
import { Button } from "@mui/material";
import { Add } from "@mui/icons-material";
import { FormattedMessage } from "react-intl";
import { Contract, utils } from "ethers";

import { useDeploy } from "@gemunion/react-hooks-eth";
import { useUser } from "@gemunion/provider-user";
import type { ILotteryConfigDto, IUser } from "@framework/types";

import LotteryDeployLotteryABI from "../../../../../abis/mechanics/lottery/contract/deployLottery.abi.json";

import { LotteryDeployDialog } from "./dialog";

export interface ILotteryDeployButtonProps {
  className?: string;
}

export const LotteryDeployButton: FC<ILotteryDeployButtonProps> = props => {
  const { className } = props;

  const user = useUser<IUser>();

  const { isDeployDialogOpen, handleDeployCancel, handleDeployConfirm, handleDeploy } = useDeploy(
    (values: ILotteryConfigDto, web3Context, sign) => {
      const nonce = utils.arrayify(sign.nonce);
      const contract = new Contract(
        process.env.CONTRACT_MANAGER_ADDR,
        LotteryDeployLotteryABI,
        web3Context.provider?.getSigner(),
      );

      return contract.deployLottery(
        {
          nonce,
          bytecode: sign.bytecode,
          externalId: user.profile.id,
        },
        {
          config: {
            timeLagBeforeRelease: values.timeLagBeforeRelease,
            commission: values.commission,
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
      <Button
        variant="outlined"
        startIcon={<Add />}
        onClick={handleDeploy}
        data-testid="LotteryDeployButton"
        className={className}
      >
        <FormattedMessage id="form.buttons.deploy" />
      </Button>
      <LotteryDeployDialog
        onConfirm={onDeployConfirm}
        onCancel={handleDeployCancel}
        open={isDeployDialogOpen}
        initialValues={{
          timeLagBeforeRelease: 100,
          commission: 30,
        }}
      />
    </Fragment>
  );
};