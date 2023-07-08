import { FC, Fragment } from "react";
import { Button } from "@mui/material";
import { Add } from "@mui/icons-material";
import { FormattedMessage } from "react-intl";
import { Contract, utils } from "ethers";

import { useDeploy } from "@gemunion/react-hooks-eth";
import { useUser } from "@gemunion/provider-user";
import type { IUser, IWaitListContractDeployDto } from "@framework/types";

import DeployWaitListABI from "../../../../../abis/mechanics/waitlist/deploy/deployWaitList.abi.json";

export interface IWaitListDeployButtonProps {
  className?: string;
}

export const WaitListDeployButton: FC<IWaitListDeployButtonProps> = props => {
  const { className } = props;

  const user = useUser<IUser>();

  const { handleDeployConfirm } = useDeploy((_values: IWaitListContractDeployDto, web3Context, sign) => {
    const nonce = utils.arrayify(sign.nonce);
    const contract = new Contract(
      process.env.CONTRACT_MANAGER_ADDR,
      DeployWaitListABI,
      web3Context.provider?.getSigner(),
    );

    return contract.deployWaitlist(
      {
        nonce,
        bytecode: sign.bytecode,
        externalId: user.profile.id,
      },
      sign.signature,
    ) as Promise<void>;
  });

  const onDeployConfirm = () => {
    return handleDeployConfirm(
      {
        url: "/contract-manager/waitlist",
        method: "POST",
      },
      {},
    );
  };

  return (
    <Fragment>
      <Button
        variant="outlined"
        startIcon={<Add />}
        onClick={onDeployConfirm}
        data-testid="WaitlistDeployButton"
        className={className}
      >
        <FormattedMessage id="form.buttons.deploy" />
      </Button>
    </Fragment>
  );
};
