import { FC, Fragment } from "react";
import { Button } from "@mui/material";
import { Add } from "@mui/icons-material";
import { FormattedMessage } from "react-intl";
import { useWeb3React } from "@web3-react/core";
import { Contract, utils } from "ethers";

import { useApi } from "@gemunion/provider-api-firebase";
import { IServerSignature } from "@gemunion/types-collection";
import { useDeploy } from "@gemunion/react-hooks-eth";
import { VestingTemplate, IVestingDeployDto } from "@framework/types";

import ContractManagerSol from "@framework/core-contracts/artifacts/contracts/ContractManager/ContractManager.sol/ContractManager.json";
import LinearVestingSol from "@framework/core-contracts/artifacts/contracts/Mechanics/Vesting/LinearVesting.sol/LinearVesting.json";
import GradedVestingSol from "@framework/core-contracts/artifacts/contracts/Mechanics/Vesting/GradedVesting.sol/GradedVesting.json";
import CliffVestingSol from "@framework/core-contracts/artifacts/contracts/Mechanics/Vesting/CliffVesting.sol/CliffVesting.json";

import { VestingDeployDialog } from "./deploy-dialog";

function getBytecodeByVestingTemplate(template: VestingTemplate) {
  switch (template) {
    case VestingTemplate.LINEAR:
      return LinearVestingSol.bytecode;
    case VestingTemplate.GRADED:
      return GradedVestingSol.bytecode;
    case VestingTemplate.CLIFF:
      return CliffVestingSol.bytecode;
    default:
      throw new Error("Unknown template");
  }
}

export interface IErc20VestingButtonProps {
  className?: string;
}

export const VestingDeployButton: FC<IErc20VestingButtonProps> = props => {
  const { className } = props;

  const { provider } = useWeb3React();
  const api = useApi();

  const { isDeployDialogOpen, handleDeployCancel, handleDeployConfirm, handleDeploy } = useDeploy(
    (values: IVestingDeployDto) => {
      const { contractTemplate, beneficiary, startTimestamp, duration } = values;

      return api
        .fetchJson({
          url: "/contract-manager/erc20-vesting",
          method: "POST",
          data: values,
        })
        .then((sign: IServerSignature) => {
          const nonce = utils.arrayify(sign.nonce);
          const contract = new Contract(
            process.env.CONTRACT_MANAGER_ADDR,
            ContractManagerSol.abi,
            provider?.getSigner(),
          );
          return contract.deployERC20Vesting(
            nonce,
            getBytecodeByVestingTemplate(contractTemplate),
            beneficiary,
            Math.floor(new Date(startTimestamp).getTime() / 1000), // in seconds,
            duration * 60 * 60 * 24, // days in seconds
            Object.keys(VestingTemplate).indexOf(contractTemplate),
            process.env.ACCOUNT,
            sign.signature,
          ) as Promise<void>;
        });
    },
  );

  return (
    <Fragment>
      <Button
        variant="outlined"
        startIcon={<Add />}
        onClick={handleDeploy}
        data-testid="Erc20VestingDeployButton"
        className={className}
      >
        <FormattedMessage id="form.buttons.deploy" />
      </Button>
      <VestingDeployDialog onConfirm={handleDeployConfirm} onCancel={handleDeployCancel} open={isDeployDialogOpen} />
    </Fragment>
  );
};
