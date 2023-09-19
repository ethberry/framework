import { FC, Fragment } from "react";
import { Add } from "@mui/icons-material";
import { Contract, utils } from "ethers";

import { useDeploy } from "@gemunion/react-hooks-eth";
import { useUser } from "@gemunion/provider-user";
import { ListAction, ListActionVariant } from "@framework/mui-lists";
import type { IRaffleContractDeployDto, IUser } from "@framework/types";

import DeployRaffleABI from "../../../../../../abis/mechanics/raffle/contract/deployRaffle.abi.json";

import { RaffleContractDeployDialog } from "./dialog";

export interface IRaffleContractDeployButtonProps {
  className?: string;
  disabled?: boolean;
  variant?: ListActionVariant;
}

export const RaffleContractDeployButton: FC<IRaffleContractDeployButtonProps> = props => {
  const { className, disabled, variant = ListActionVariant.button } = props;

  const { profile } = useUser<IUser>();

  const { isDeployDialogOpen, handleDeployCancel, handleDeployConfirm, handleDeploy } = useDeploy(
    (_values: IRaffleContractDeployDto, web3Context, sign) => {
      const nonce = utils.arrayify(sign.nonce);
      const contract = new Contract(
        process.env.CONTRACT_MANAGER_ADDR,
        DeployRaffleABI,
        web3Context.provider?.getSigner(),
      );

      return contract.deployRaffle(
        {
          nonce,
          bytecode: sign.bytecode,
          externalId: profile.id,
        },
        sign.signature,
      ) as Promise<void>;
    },
  );

  const onDeployConfirm = (values: any, form: any) => {
    return handleDeployConfirm(
      {
        url: "/contract-manager/raffle",
        method: "POST",
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
        dataTestId="RaffleDeployButton"
        disabled={disabled}
        variant={variant}
      />
      <RaffleContractDeployDialog onConfirm={onDeployConfirm} onCancel={handleDeployCancel} open={isDeployDialogOpen} />
    </Fragment>
  );
};
