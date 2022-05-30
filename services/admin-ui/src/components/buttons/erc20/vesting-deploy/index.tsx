import { FC, Fragment } from "react";
import { Button } from "@mui/material";
import { Add } from "@mui/icons-material";
import { FormattedMessage } from "react-intl";
import { useWeb3React } from "@web3-react/core";
import { Contract, utils } from "ethers";

import { useApi } from "@gemunion/provider-api";
import { IServerSignature } from "@gemunion/types-collection";
import { useDeploy } from "@gemunion/react-hooks-eth";
import { Erc20VestingTemplate, IErc20VestingDeployDto } from "@framework/types";
import ContractManager from "@framework/binance-contracts/artifacts/contracts/ContractManager/ContractManager.sol/ContractManager.json";
import LinearVesting from "@framework/binance-contracts/artifacts/contracts/Vesting/LinearVesting.sol/LinearVesting.json";
import GradedVesting from "@framework/binance-contracts/artifacts/contracts/Vesting/GradedVesting.sol/GradedVesting.json";
import CliffVesting from "@framework/binance-contracts/artifacts/contracts/Vesting/CliffVesting.sol/CliffVesting.json";

import { Erc20VestingDeployDialog } from "./deploy-dialog";

function getBytecodeByErc20VestingTemplate(template: Erc20VestingTemplate) {
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
  const api = useApi();

  const { isDeployDialogOpen, handleDeployCancel, handleDeployConfirm, handleDeploy } = useDeploy(
    (values: IErc20VestingDeployDto) => {
      const { contractTemplate, beneficiary, startTimestamp, duration } = values;

      return api
        .fetchJson({
          url: "/contract-manager/erc20-vesting",
          method: "POST",
          data: values,
        })
        .then((sign: IServerSignature) => {
          const nonce = utils.arrayify(sign.nonce);
          const contract = new Contract(process.env.CONTRACT_MANAGER_ADDR, ContractManager.abi, library.getSigner());
          return contract.deployERC20Vesting(
            nonce,
            getBytecodeByErc20VestingTemplate(contractTemplate),
            beneficiary,
            Math.floor(new Date(startTimestamp).getTime() / 1000), // in seconds,
            duration * 60 * 60 * 24, // days in seconds
            Object.keys(Erc20VestingTemplate).indexOf(contractTemplate),
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
