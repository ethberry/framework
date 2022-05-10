import { FC, Fragment, useState } from "react";
import { Button } from "@mui/material";
import { Add } from "@mui/icons-material";
import { FormattedMessage } from "react-intl";
import { useWeb3React } from "@web3-react/core";
import { ethers } from "ethers";

import { useMetamask } from "@gemunion/react-hooks";
import { IErc20Vesting } from "@framework/types";
import contractManager from "@framework/binance-contracts/artifacts/contracts/ContractManager/ContractManager.sol/ContractManager.json";

import { Erc20VestingDeployDialog } from "./deploy";

export interface IErc20VestingButtonProps {
  className?: string;
}

export const Erc20VestingButton: FC<IErc20VestingButtonProps> = props => {
  const { className } = props;

  const { library } = useWeb3React();

  const [isDeployDialogOpen, setIsDeployDialogOpen] = useState(false);

  const handleDeploy = (): void => {
    setIsDeployDialogOpen(true);
  };

  const metaDeploy = useMetamask((values: IErc20Vesting) => {
    const { vestingType, token, amount, beneficiary, startTimestamp, duration } = values;
    const contract = new ethers.Contract(process.env.CONTRACT_MANAGER, contractManager.abi, library.getSigner());
    return contract.deployVesting(vestingType, token, amount, beneficiary, startTimestamp, duration) as Promise<void>;
  });

  const handleDeployConfirm = (values: any) => {
    const { vestingType, token, amount, beneficiary, startTimestamp, duration } = values;
    return metaDeploy({
      vestingType,
      token,
      amount,
      beneficiary,
      startTimestamp: Math.ceil(startTimestamp.getTime() / 1000),
      duration: duration * 86400,
    }) as Promise<void>;
  };

  const handleDeployCancel = () => {
    setIsDeployDialogOpen(false);
  };

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
