import { FC, Fragment } from "react";
import { Button } from "@mui/material";
import { Add } from "@mui/icons-material";
import { FormattedMessage } from "react-intl";
import { useWeb3React } from "@web3-react/core";
import { ethers } from "ethers";

import ContractManager from "@framework/binance-contracts/artifacts/contracts/ContractManager/ContractManager.sol/ContractManager.json";
import LinearVesting from "@framework/binance-contracts/artifacts/contracts/Vesting/LinearVesting.sol/LinearVesting.json";
import GradedVesting from "@framework/binance-contracts/artifacts/contracts/Vesting/GradedVesting.sol/GradedVesting.json";
import CliffVesting from "@framework/binance-contracts/artifacts/contracts/Vesting/CliffVesting.sol/CliffVesting.json";

import { Erc20VestingDeployDialog, IErc20VestingContractFields, Erc20VestingTemplate } from "./deploy-dialog";
import { useDeploy } from "../../../hooks/useCollection";

function getBytecodeByTemplate(template: Erc20VestingTemplate) {
  switch (template) {
    case Erc20VestingTemplate.LINEAR:
      return LinearVesting.bytecode;
    case Erc20VestingTemplate.GRADED:
      return GradedVesting.bytecode;
    case Erc20VestingTemplate.CLIFF:
      return CliffVesting.bytecode;
    default:
      throw new Error("Unknown template");
  }
}

export interface IErc20VestingButtonProps {
  className?: string;
}

export const Erc20VestingDeployButton: FC<IErc20VestingButtonProps> = props => {
  const { className } = props;

  const { library } = useWeb3React();

  const { isDeployDialogOpen, handleDeployCancel, handleDeployConfirm, handleDeploy } = useDeploy(
    (values: IErc20VestingContractFields) => {
      const { contractTemplate, beneficiary, startTimestamp, duration } = values;
      const contract = new ethers.Contract(process.env.CONTRACT_MANAGER, ContractManager.abi, library.getSigner());
      return contract.deployVesting(
        getBytecodeByTemplate(contractTemplate),
        beneficiary,
        startTimestamp,
        duration,
      ) as Promise<void>;
    },
  );

  return (
    <Fragment>
      <Button
        variant="outlined"
        startIcon={<Add />}
        onClick={handleDeploy}
        data-testid="erc20VestingDeployButton"
        className={className}
      >
        <FormattedMessage id="form.buttons.add" />
      </Button>
      <Erc20VestingDeployDialog
        onConfirm={handleDeployConfirm}
        onCancel={handleDeployCancel}
        open={isDeployDialogOpen}
      />
    </Fragment>
  );
};
