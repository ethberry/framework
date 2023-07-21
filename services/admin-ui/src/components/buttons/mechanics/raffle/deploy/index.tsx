import { FC, Fragment } from "react";
import { Button } from "@mui/material";
import { Add } from "@mui/icons-material";
import { FormattedMessage } from "react-intl";
import { Contract, utils } from "ethers";

import { useDeploy } from "@gemunion/react-hooks-eth";
import { useUser } from "@gemunion/provider-user";
import type { IRaffleContractDeployDto, IUser } from "@framework/types";

import DeployRaffleABI from "../../../../../abis/mechanics/raffle/contract/deployRaffle.abi.json";

export interface IRaffleContractDeployButtonProps {
  className?: string;
}

export const RaffleContractDeployButton: FC<IRaffleContractDeployButtonProps> = props => {
  const { className } = props;

  const user = useUser<IUser>();

  const { handleDeployConfirm } = useDeploy((_values: IRaffleContractDeployDto, web3Context, sign) => {
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
        externalId: user.profile.id,
      },
      sign.signature,
    ) as Promise<void>;
  });

  const onDeployConfirm = () => {
    return handleDeployConfirm(
      {
        url: "/contract-manager/raffle",
        method: "POT",
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
        data-testid="RaffleDeployButton"
        className={className}
      >
        <FormattedMessage id="form.buttons.deploy" />
      </Button>
    </Fragment>
  );
};
