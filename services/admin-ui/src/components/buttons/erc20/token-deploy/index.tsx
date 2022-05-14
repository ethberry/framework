import { FC, Fragment } from "react";
import { Button } from "@mui/material";
import { Add } from "@mui/icons-material";
import { FormattedMessage } from "react-intl";
import { useWeb3React } from "@web3-react/core";
import { ethers } from "ethers";

import contractManager from "@framework/binance-contracts/artifacts/contracts/ContractManager/ContractManager.sol/ContractManager.json";
import coin from "@framework/binance-contracts/artifacts/contracts/ERC20/Coin.sol/Coin.json";

import { Erc20TokenDeployDialog, IErc20TokenContractFields } from "./deploy-dialog";
import { useDeploy } from "../../../hooks/useCollection";

export interface IErc20TokenDeployButtonProps {
  className?: string;
}

export const Erc20TokenDeployButton: FC<IErc20TokenDeployButtonProps> = props => {
  const { className } = props;

  const { library } = useWeb3React();

  const { isDeployDialogOpen, handleDeployCancel, handleDeployConfirm, handleDeploy } = useDeploy(
    (values: IErc20TokenContractFields) => {
      const { contractTemplate, name, symbol, amount } = values;

      void contractTemplate;

      const contract = new ethers.Contract(process.env.CONTRACT_MANAGER, contractManager.abi, library.getSigner());
      return contract.deployERC20Token(coin.bytecode, name, symbol, amount) as Promise<void>;
    },
  );

  return (
    <Fragment>
      <Button
        variant="outlined"
        startIcon={<Add />}
        onClick={handleDeploy}
        data-testid="erc20TokenDeployButton"
        className={className}
      >
        <FormattedMessage id="form.buttons.add" />
      </Button>
      <Erc20TokenDeployDialog onConfirm={handleDeployConfirm} onCancel={handleDeployCancel} open={isDeployDialogOpen} />
    </Fragment>
  );
};
