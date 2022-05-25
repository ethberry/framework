import { FC, Fragment } from "react";
import { Button } from "@mui/material";
import { Add } from "@mui/icons-material";
import { FormattedMessage } from "react-intl";
import { useWeb3React } from "@web3-react/core";
import { Contract, utils } from "ethers";

import { useApi } from "@gemunion/provider-api";
import { IServerSignature } from "@gemunion/types-collection";
import { useDeploy } from "@gemunion/react-hooks";
import { Erc721TokenTemplate, IErc721CollectionDeployDto } from "@framework/types";
import ContractManager from "@framework/binance-contracts/artifacts/contracts/ContractManager/ContractManager.sol/ContractManager.json";
import ERC721Simple from "@framework/binance-contracts/artifacts/contracts/ERC721/ERC721Simple.sol/ERC721Simple.json";
import ERC721Graded from "@framework/binance-contracts/artifacts/contracts/ERC721/ERC721Graded.sol/ERC721Graded.json";
import ERC721RandomTest from "@framework/binance-contracts/artifacts/contracts/ERC721/test/ERC721RandomTest.sol/ERC721RandomTest.json";
// import ERC721Random from "@framework/binance-contracts/artifacts/contracts/ERC721/ERC721Random.sol/ERC721Random.json";

import { Erc721CollectionDeployDialog } from "./deploy-dialog";

function getBytecodeByErc721TokenTemplate(template: Erc721TokenTemplate) {
  switch (template) {
    case Erc721TokenTemplate.SIMPLE:
      return ERC721Simple.bytecode;
    case Erc721TokenTemplate.GRADED:
      return ERC721Graded.bytecode;
    case Erc721TokenTemplate.RANDOM:
      return ERC721RandomTest.bytecode;
    // return ERC721Random.bytecode;
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
  const api = useApi();

  const { isDeployDialogOpen, handleDeployCancel, handleDeployConfirm, handleDeploy } = useDeploy(
    (values: IErc721CollectionDeployDto) => {
      const { contractTemplate, name, symbol, baseTokenURI, royalty } = values;

      return api
        .fetchJson({
          url: "/contract-manager/erc721-token",
          method: "POST",
          data: values,
        })
        .then((sign: IServerSignature) => {
          const nonce = utils.arrayify(sign.nonce);
          const contract = new Contract(process.env.CONTRACT_MANAGER_ADDR, ContractManager.abi, library.getSigner());
          return contract.deployERC721Token(
            nonce,
            getBytecodeByErc721TokenTemplate(contractTemplate),
            name,
            symbol,
            baseTokenURI,
            royalty,
            Object.keys(Erc721TokenTemplate).indexOf(contractTemplate),
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
        data-testid="erc721TokenDeployButton"
        className={className}
      >
        <FormattedMessage id="form.buttons.add" />
      </Button>
      <Erc721CollectionDeployDialog
        onConfirm={handleDeployConfirm}
        onCancel={handleDeployCancel}
        open={isDeployDialogOpen}
      />
    </Fragment>
  );
};
