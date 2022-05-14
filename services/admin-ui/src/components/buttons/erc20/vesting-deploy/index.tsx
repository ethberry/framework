import { FC, Fragment } from "react";
import { Button } from "@mui/material";
import { Add } from "@mui/icons-material";
import { FormattedMessage } from "react-intl";
import { useWeb3React } from "@web3-react/core";
import { ethers } from "ethers";

import contractManager from "@framework/binance-contracts/artifacts/contracts/ContractManager/ContractManager.sol/ContractManager.json";
import flatVesting from "@framework/binance-contracts/artifacts/contracts/Vesting/FlatVesting.sol/FlatVesting.json";

import { Erc20VestingDeployDialog, IErc20VestingContractFields } from "./deploy-dialog";
import { useDeploy } from "../../../hooks/useCollection";

export interface IErc20VestingButtonProps {
  className?: string;
}

export const Erc20VestingDeployButton: FC<IErc20VestingButtonProps> = props => {
  const { className } = props;

  const { library } = useWeb3React();

  const { isDeployDialogOpen, handleDeployCancel, handleDeployConfirm, handleDeploy } = useDeploy(
    (values: IErc20VestingContractFields) => {
      const { contractTemplate, beneficiary, startTimestamp, duration } = values;

      void contractTemplate;

      const contract = new ethers.Contract(process.env.CONTRACT_MANAGER, contractManager.abi, library.getSigner());
      return contract.deployVesting(flatVesting.bytecode, beneficiary, startTimestamp, duration) as Promise<void>;
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
