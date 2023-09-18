import { FC } from "react";
import { Add } from "@mui/icons-material";
import { Contract, utils } from "ethers";

import { useDeploy } from "@gemunion/react-hooks-eth";
import { useUser } from "@gemunion/provider-user";
import { ListAction, ListActionVariant } from "@framework/mui-lists";
import type { IUser, IWaitListContractDeployDto } from "@framework/types";

import DeployWaitListABI from "../../../../../../abis/mechanics/wait-list/deploy/deployWaitList.abi.json";

export interface IWaitListDeployButtonProps {
  disabled?: boolean;
  variant?: ListActionVariant;
}

export const WaitListDeployButton: FC<IWaitListDeployButtonProps> = props => {
  const { disabled, variant = ListActionVariant.button } = props;

  const { profile } = useUser<IUser>();

  const { handleDeployConfirm } = useDeploy((_values: IWaitListContractDeployDto, web3Context, sign) => {
    const nonce = utils.arrayify(sign.nonce);
    const contract = new Contract(
      process.env.CONTRACT_MANAGER_ADDR,
      DeployWaitListABI,
      web3Context.provider?.getSigner(),
    );

    return contract.deployWaitList(
      {
        nonce,
        bytecode: sign.bytecode,
        externalId: profile.id,
      },
      sign.signature,
    ) as Promise<void>;
  });

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
      dataTestId="WaitlistDeployButton"
      disabled={disabled}
      variant={variant}
    />
  );
};
