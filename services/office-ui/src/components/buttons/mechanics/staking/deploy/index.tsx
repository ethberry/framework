import { FC, Fragment } from "react";
import { Button } from "@mui/material";
import { Add } from "@mui/icons-material";
import { FormattedMessage } from "react-intl";
import { Contract, utils } from "ethers";

import { useDeploy } from "@gemunion/react-hooks-eth";
import { IStakingContractDeployDto } from "@framework/types";

import DeployStakingABI from "./deployStaking.abi.json";

import { StakingDeployDialog } from "./dialog";

export interface IStakingDeployButtonProps {
  className?: string;
}

export const StakingDeployButton: FC<IStakingDeployButtonProps> = props => {
  const { className } = props;

  const { isDeployDialogOpen, handleDeployCancel, handleDeployConfirm, handleDeploy } = useDeploy(
    (values: IStakingContractDeployDto, web3Context, sign) => {
      const nonce = utils.arrayify(sign.nonce);
      const contract = new Contract(
        process.env.CONTRACT_MANAGER_ADDR,
        DeployStakingABI,
        web3Context.provider?.getSigner(),
      );

      return contract.deployStaking(
        {
          nonce,
          bytecode: sign.bytecode,
        },
        values,
        sign.signature,
      ) as Promise<void>;
    },
  );

  const onDeployConfirm = (values: Record<string, any>, form: any) => {
    return handleDeployConfirm(
      {
        url: "/contract-manager/staking",
        method: "POST",
        data: values,
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
        data-testid="StakingDeployButton"
        className={className}
      >
        <FormattedMessage id="form.buttons.deploy" />
      </Button>
      <StakingDeployDialog onConfirm={onDeployConfirm} onCancel={handleDeployCancel} open={isDeployDialogOpen} />
    </Fragment>
  );
};
