import { FC } from "react";
import { Add } from "@mui/icons-material";
import { Contract, utils } from "ethers";

import { useDeploy } from "@gemunion/react-hooks-eth";
import { useUser } from "@gemunion/provider-user";
import { ListAction, ListActionVariant } from "@framework/styled";
import type { IContract, IUser, IWaitListContractDeployDto } from "@framework/types";

import DeployWaitListABI from "@framework/abis/deployWaitList/WaitListFactoryFacet.json";

export interface IWaitListDeployButtonProps {
  className?: string;
  disabled?: boolean;
  variant?: ListActionVariant;
}

export const WaitListDeployButton: FC<IWaitListDeployButtonProps> = props => {
  const { className, disabled, variant = ListActionVariant.button } = props;

  const { profile } = useUser<IUser>();

  const { handleDeployConfirm } = useDeploy(
    (_values: IWaitListContractDeployDto, web3Context, sign, systemContract: IContract) => {
      const nonce = utils.arrayify(sign.nonce);
      const contract = new Contract(systemContract.address, DeployWaitListABI, web3Context.provider?.getSigner());

      return contract.deployWaitList(
        {
          nonce,
          bytecode: sign.bytecode,
          externalId: profile.id,
        },
        sign.signature,
      ) as Promise<void>;
    },
  );

  const onDeployConfirm = () => {
    return handleDeployConfirm(
      {
        url: "/contract-manager/wait-list",
        method: "POST",
        data: {},
      },
      {},
    );
  };

  return (
    <ListAction
      onClick={onDeployConfirm}
      icon={Add}
      message="form.buttons.deploy"
      className={className}
      dataTestId="WaitlistDeployButton"
      disabled={disabled}
      variant={variant}
    />
  );
};
