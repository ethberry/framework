import { FC, Fragment } from "react";
import { Button } from "@mui/material";
import { Add } from "@mui/icons-material";
import { FormattedMessage } from "react-intl";
import { useWeb3React } from "@web3-react/core";
import { ethers } from "ethers";

import ContractManager from "@framework/binance-contracts/artifacts/contracts/ContractManager/ContractManager.sol/ContractManager.json";
import ERC721Simple from "@framework/binance-contracts/artifacts/contracts/ERC721/ERC721Simple.sol/ERC721Simple.json";
import ERC721Graded from "@framework/binance-contracts/artifacts/contracts/ERC721/ERC721Graded.sol/ERC721Graded.json";
import ERC721Random from "@framework/binance-contracts/artifacts/contracts/ERC721/ERC721Random.sol/ERC721Random.json";

import { Erc721TokenDeployDialog, IErc721TokenContractFields, Erc721TokenTemplate } from "./deploy-dialog";
import { useDeploy } from "../../../hooks/useCollection";

function getBytecodeByTemplate(template: Erc721TokenTemplate) {
  switch (template) {
    case Erc721TokenTemplate.SIMPLE:
      return ERC721Simple.bytecode;
    case Erc721TokenTemplate.GRADED:
      return ERC721Graded.bytecode;
    case Erc721TokenTemplate.RANDOM:
      return ERC721Random.bytecode;
    default:
      throw new Error("Unknown template");
  }
}

export interface IErc721TokenDeployButtonProps {
  className?: string;
}

export const Erc721TokenDeployButton: FC<IErc721TokenDeployButtonProps> = props => {
  const { className } = props;

  const { library } = useWeb3React();

  const { isDeployDialogOpen, handleDeployCancel, handleDeployConfirm, handleDeploy } = useDeploy(
    (values: IErc721TokenContractFields) => {
      const { contractTemplate, name, symbol, baseTokenURI, royalty } = values;
      const contract = new ethers.Contract(process.env.CONTRACT_MANAGER, ContractManager.abi, library.getSigner());
      return contract.deployERC721Token(
        getBytecodeByTemplate(contractTemplate),
        name,
        symbol,
        baseTokenURI,
        royalty,
      ) as Promise<void>;
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
