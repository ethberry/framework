import { FC, Fragment } from "react";
import { Button } from "@mui/material";
import { Add } from "@mui/icons-material";
import { FormattedMessage } from "react-intl";
import { useWeb3React } from "@web3-react/core";
import { ethers } from "ethers";

import contractManager from "@framework/binance-contracts/artifacts/contracts/ContractManager/ContractManager.sol/ContractManager.json";
import coin from "@framework/binance-contracts/artifacts/contracts/ERC721/Skill.sol/Skill.json";

import { Erc721TokenDeployDialog, IErc721TokenContractFields } from "./deploy-dialog";
import { useDeploy } from "../../../hooks/useCollection";

export interface IErc721TokenDeployButtonProps {
  className?: string;
}

export const Erc721TokenDeployButton: FC<IErc721TokenDeployButtonProps> = props => {
  const { className } = props;

  const { library } = useWeb3React();

  const { isDeployDialogOpen, handleDeployCancel, handleDeployConfirm, handleDeploy } = useDeploy(
    (values: IErc721TokenContractFields) => {
      const { contractTemplate, name, symbol, baseTokenURI, royalty } = values;

      void contractTemplate;

      const contract = new ethers.Contract(process.env.CONTRACT_MANAGER, contractManager.abi, library.getSigner());
      return contract.deployERC721Token(coin.bytecode, name, symbol, baseTokenURI, royalty) as Promise<void>;
    },
  );

  return (
    <Fragment>
      <Button
        variant="outlined"
        startIcon={<Add />}
        onClick={handleDeploy}
        data-testid="erc721TokenDeployButton"
        className={className}
      >
        <FormattedMessage id="form.buttons.add" />
      </Button>
      <Erc721TokenDeployDialog
        onConfirm={handleDeployConfirm}
        onCancel={handleDeployCancel}
        open={isDeployDialogOpen}
      />
    </Fragment>
  );
};
