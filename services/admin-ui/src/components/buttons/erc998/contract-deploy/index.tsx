import { FC, Fragment } from "react";
import { Button } from "@mui/material";
import { Add } from "@mui/icons-material";
import { FormattedMessage } from "react-intl";
import { useWeb3React } from "@web3-react/core";
import { Contract, utils } from "ethers";

import { useApi } from "@gemunion/provider-api-firebase";
import { IServerSignature } from "@gemunion/types-collection";
import { useDeploy } from "@gemunion/react-hooks-eth";
import { Erc998ContractTemplate, IErc998CollectionDeployDto } from "@framework/types";

import ContractManagerSol from "@framework/core-contracts/artifacts/contracts/ContractManager/ContractManager.sol/ContractManager.json";
import ERC998SimpleSol from "@framework/core-contracts/artifacts/contracts/ERC721/ERC721Simple.sol/ERC721Simple.json";
import ERC998GradedSol from "@framework/core-contracts/artifacts/contracts/ERC721/ERC721Graded.sol/ERC721Graded.json";
import ERC998RandomTestSol from "@framework/core-contracts/artifacts/contracts/ERC721/test/ERC721RandomTest.sol/ERC721RandomTest.json";
// import ERC998RandomSol from "@framework/core-contracts/artifacts/contracts/ERC998/ERC998Random.sol/ERC998Random.json";
import { Erc998ContractDeployDialog } from "./deploy-dialog";

function getBytecodeByErc998TokenTemplate(template: Erc998ContractTemplate) {
  switch (template) {
    case Erc998ContractTemplate.SIMPLE:
      return ERC998SimpleSol.bytecode;
    case Erc998ContractTemplate.GRADED:
      return ERC998GradedSol.bytecode;
    case Erc998ContractTemplate.RANDOM:
      return ERC998RandomTestSol.bytecode;
    // return ERC998RandomSol.bytecode;
    default:
      throw new Error("Unknown template");
  }
}

export interface ITokenDeployButtonProps {
  className?: string;
}

export const Erc998TokenDeployButton: FC<ITokenDeployButtonProps> = props => {
  const { className } = props;

  const { library } = useWeb3React();
  const api = useApi();

  const { isDeployDialogOpen, handleDeployCancel, handleDeployConfirm, handleDeploy } = useDeploy(
    (values: IErc998CollectionDeployDto) => {
      const { contractTemplate, name, symbol, baseTokenURI, royalty } = values;

      return api
        .fetchJson({
          url: "/contract-manager/erc998-token",
          method: "POST",
          data: values,
        })
        .then((sign: IServerSignature) => {
          const nonce = utils.arrayify(sign.nonce);
          const contract = new Contract(process.env.CONTRACT_MANAGER_ADDR, ContractManagerSol.abi, library.getSigner());
          return contract.deployERC998Token(
            nonce,
            getBytecodeByErc998TokenTemplate(contractTemplate),
            name,
            symbol,
            baseTokenURI,
            royalty,
            Object.keys(Erc998ContractTemplate).indexOf(contractTemplate),
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
        data-testid="Erc998TokenDeployButton"
        className={className}
      >
        <FormattedMessage id="form.buttons.deploy" />
      </Button>
      <Erc998ContractDeployDialog
        onConfirm={handleDeployConfirm}
        onCancel={handleDeployCancel}
        open={isDeployDialogOpen}
      />
    </Fragment>
  );
};
