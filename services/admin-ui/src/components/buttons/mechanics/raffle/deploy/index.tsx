import { FC, Fragment } from "react";
import { Button } from "@mui/material";
import { Add } from "@mui/icons-material";
import { FormattedMessage } from "react-intl";
import { Contract, utils } from "ethers";

import { useDeploy } from "@gemunion/react-hooks-eth";
import { IRaffleConfigDto } from "@framework/types";

import RaffleDeployRaffleABI from "../../../../../abis/mechanics/raffle/contract/deployRaffle.abi.json";

import { RaffleDeployDialog } from "./dialog";

export interface IRaffleDeployButtonProps {
  className?: string;
}

export const RaffleDeployButton: FC<IRaffleDeployButtonProps> = props => {
  const { className } = props;

  const { isDeployDialogOpen, handleDeployCancel, handleDeployConfirm, handleDeploy } = useDeploy(
    (values: IRaffleConfigDto, web3Context, sign) => {
      const nonce = utils.arrayify(sign.nonce);
      const contract = new Contract(
        process.env.CONTRACT_MANAGER_ADDR,
        RaffleDeployRaffleABI,
        web3Context.provider?.getSigner(),
      );

      return contract.deployRaffle(
        {
          nonce,
          bytecode: sign.bytecode,
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
        url: "/contract-manager/raffle",
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
        data-testid="RaffleDeployButton"
        className={className}
      >
        <FormattedMessage id="form.buttons.deploy" />
      </Button>
      <RaffleDeployDialog
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
