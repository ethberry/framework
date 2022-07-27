import { FC, Fragment } from "react";
import { Button } from "@mui/material";
import { Add } from "@mui/icons-material";
import { FormattedMessage } from "react-intl";
import { Contract, utils } from "ethers";

import { useDeploy } from "@gemunion/react-hooks-eth";
import { IVestingDeployDto, VestingContractTemplate } from "@framework/types";

import ContractManagerSol from "@framework/core-contracts/artifacts/contracts/ContractManager/ContractManager.sol/ContractManager.json";
import LinearVestingSol from "@framework/core-contracts/artifacts/contracts/Mechanics/Vesting/LinearVesting.sol/LinearVesting.json";
import GradedVestingSol from "@framework/core-contracts/artifacts/contracts/Mechanics/Vesting/GradedVesting.sol/GradedVesting.json";
import CliffVestingSol from "@framework/core-contracts/artifacts/contracts/Mechanics/Vesting/CliffVesting.sol/CliffVesting.json";

import { VestingDeployDialog } from "./deploy-dialog";

function getBytecodeByVestingContractTemplate(template: VestingContractTemplate) {
  switch (template) {
    case VestingContractTemplate.LINEAR:
      return LinearVestingSol.bytecode;
    case VestingContractTemplate.GRADED:
      return GradedVestingSol.bytecode;
    case VestingContractTemplate.CLIFF:
      return CliffVestingSol.bytecode;
    default:
      throw new Error("Unknown template");
  }
}

export interface IVestingButtonProps {
  className?: string;
}

export const VestingDeployButton: FC<IVestingButtonProps> = props => {
  const { className } = props;

  const { isDeployDialogOpen, handleDeployCancel, handleDeployConfirm, handleDeploy } = useDeploy(
    (values: IVestingDeployDto, web3Context, sign) => {
      const { contractTemplate, account, startTimestamp, duration } = values;

      const nonce = utils.arrayify(sign.nonce);
      const contract = new Contract(
        process.env.CONTRACT_MANAGER_ADDR,
        ContractManagerSol.abi,
        web3Context.provider?.getSigner(),
      );
      return contract.deployVesting(
        nonce,
        getBytecodeByVestingContractTemplate(contractTemplate),
        account,
        Math.floor(new Date(startTimestamp).getTime() / 1000), // in seconds,
        duration * 60 * 60 * 24, // days in seconds
        Object.keys(VestingContractTemplate).indexOf(contractTemplate),
        process.env.ACCOUNT,
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
