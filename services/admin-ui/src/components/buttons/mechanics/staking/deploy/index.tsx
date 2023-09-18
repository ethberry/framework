import { FC, Fragment } from "react";
import { Add } from "@mui/icons-material";
import { Contract, utils } from "ethers";

import { useDeploy } from "@gemunion/react-hooks-eth";
import { useUser } from "@gemunion/provider-user";
import { ListAction, ListActionVariant } from "@framework/mui-lists";
import type { IStakingContractDeployDto, IUser } from "@framework/types";
import { StakingContractTemplates } from "@framework/types";

import DeployStakingABI from "../../../../../abis/mechanics/staking/deploy/deployStaking.abi.json";

import { StakingDeployDialog } from "./dialog";

export interface IStakingDeployButtonProps {
  disabled?: boolean;
  variant?: ListActionVariant;
}

export const StakingDeployButton: FC<IStakingDeployButtonProps> = props => {
  const { disabled, variant = ListActionVariant.button } = props;

  const { profile } = useUser<IUser>();

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
          externalId: profile.id,
        },
        // values,
        {
          contractTemplate: Object.values(StakingContractTemplates).indexOf(values.contractTemplate).toString(),
        },
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
      <ListAction
        onClick={handleDeploy}
        icon={Add}
        message="form.buttons.deploy"
        dataTestId="StakingDeployButton"
        disabled={disabled}
        variant={variant}
      />
      <StakingDeployDialog onConfirm={onDeployConfirm} onCancel={handleDeployCancel} open={isDeployDialogOpen} />
    </Fragment>
  );
};
