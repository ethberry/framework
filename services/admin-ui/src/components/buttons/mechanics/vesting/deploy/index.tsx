import { FC, Fragment } from "react";
import { Button } from "@mui/material";
import { Add } from "@mui/icons-material";
import { FormattedMessage } from "react-intl";
import { Contract, utils } from "ethers";

import { useDeploy } from "@gemunion/react-hooks-eth";
import { IVestingContractDeployDto, VestingContractTemplate } from "@framework/types";

import ContractManagerSol from "@framework/core-contracts/artifacts/contracts/ContractManager/ContractManager.sol/ContractManager.json";

import { VestingDeployDialog } from "./dialog";

export interface IVestingDeployButtonProps {
  className?: string;
}

export const VestingDeployButton: FC<IVestingDeployButtonProps> = props => {
  const { className } = props;

  const { isDeployDialogOpen, handleDeployCancel, handleDeployConfirm, handleDeploy } = useDeploy(
    (values: IVestingContractDeployDto, web3Context, sign) => {
      const { contractTemplate, account, startTimestamp, duration } = values;

      const nonce = utils.arrayify(sign.nonce);
      const contract = new Contract(
        process.env.CONTRACT_MANAGER_ADDR,
        ContractManagerSol.abi,
        web3Context.provider?.getSigner(),
      );

      return contract.deployVesting(
        {
          nonce,
          bytecode: sign.bytecode,
        },
        {
          account,
          startTimestamp: Math.ceil(new Date(startTimestamp).getTime() / 1000), // in seconds,
          duration: duration * 60 * 60 * 24, // days in seconds
          contractTemplate: Object.values(VestingContractTemplate).indexOf(contractTemplate).toString(),
        },
        sign.signature,
      ) as Promise<void>;
    },
  );

  const onDeployConfirm = (values: Record<string, any>, form: any) => {
    return handleDeployConfirm(
      {
        url: "/contract-manager/vesting",
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
        data-testid="VestingDeployButton"
        className={className}
      >
        <FormattedMessage id="form.buttons.deploy" />
      </Button>
      <VestingDeployDialog onConfirm={onDeployConfirm} onCancel={handleDeployCancel} open={isDeployDialogOpen} />
    </Fragment>
  );
};
