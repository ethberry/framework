import { FC, Fragment } from "react";
import { Button } from "@mui/material";
import { Add } from "@mui/icons-material";
import { FormattedMessage } from "react-intl";
import { useWeb3React } from "@web3-react/core";
import { ethers } from "ethers";

import contractManager from "@framework/binance-contracts/artifacts/contracts/ContractManager/ContractManager.sol/ContractManager.json";
import resources from "@framework/binance-contracts/artifacts/contracts/ERC1155/Resources.sol/Resources.json";

import { Erc1155TokenDeployDialog, IErc1155ContractFields } from "./deploy-dialog";
import { useDeploy } from "../../../hooks/useCollection";

export interface IErc1155TokenDeployButtonProps {
  className?: string;
}

export const Erc1155TokenDeployButton: FC<IErc1155TokenDeployButtonProps> = props => {
  const { className } = props;

  const { library } = useWeb3React();

  const { isDeployDialogOpen, handleDeployCancel, handleDeployConfirm, handleDeploy } = useDeploy(
    (values: IErc1155ContractFields) => {
      const { contractTemplate, baseTokenURI } = values;

      void contractTemplate;

      const contract = new ethers.Contract(process.env.CONTRACT_MANAGER, contractManager.abi, library.getSigner());
      return contract.deployERC1155Token(resources.bytecode, baseTokenURI) as Promise<void>;
    },
  );

  return (
    <Fragment>
      <Button
        variant="outlined"
        startIcon={<Add />}
        onClick={handleDeploy}
        data-testid="erc1155TokenDeployButton"
        className={className}
      >
        <FormattedMessage id="form.buttons.add" />
      </Button>
      <Erc1155TokenDeployDialog
        onConfirm={handleDeployConfirm}
        onCancel={handleDeployCancel}
        open={isDeployDialogOpen}
      />
    </Fragment>
  );
};
