import { FC, Fragment } from "react";
import { Button } from "@mui/material";
import { Add } from "@mui/icons-material";
import { FormattedMessage } from "react-intl";
import { Contract, utils } from "ethers";

import { useDeploy } from "@gemunion/react-hooks-eth";
import type { IPonziContractDeployDto } from "@framework/types";

import DeployPonziABI from "../../../../../abis/mechanics/ponzi/deploy/deployPonzi.abi.json";

import { PonziContractDeployDialog } from "./dialog";

export interface IPonziContractDeployButtonProps {
  className?: string;
}

export const PonziDeployButton: FC<IPonziContractDeployButtonProps> = props => {
  const { className } = props;

  const { isDeployDialogOpen, handleDeployCancel, handleDeployConfirm, handleDeploy } = useDeploy(
    (values: IPonziContractDeployDto, web3Context, sign) => {
      const nonce = utils.arrayify(sign.nonce);
      const contract = new Contract(
        process.env.CONTRACT_MANAGER_ADDR,
        DeployPonziABI,
        web3Context.provider?.getSigner(),
      );

      return contract.deployPonzi(
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
        url: "/contract-manager/ponzi",
        method: "POST",
        data: {
          contractTemplate: values.contractTemplate,
          payees: [values.payees],
          shares: [values.shares],
        },
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
        data-testid="PonziContractDeployButton"
        className={className}
      >
        <FormattedMessage id="form.buttons.deploy" />
      </Button>
      <PonziContractDeployDialog onConfirm={onDeployConfirm} onCancel={handleDeployCancel} open={isDeployDialogOpen} />
    </Fragment>
  );
};
