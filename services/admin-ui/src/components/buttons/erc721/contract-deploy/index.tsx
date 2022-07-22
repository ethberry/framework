import { FC, Fragment } from "react";
import { Button } from "@mui/material";
import { Add } from "@mui/icons-material";
import { FormattedMessage } from "react-intl";
import { Web3ContextType } from "@web3-react/core";
import { Contract, utils } from "ethers";

import { IServerSignature } from "@gemunion/types-collection";
import { useDeploy } from "@gemunion/react-hooks-eth";
import { Erc721ContractTemplate, IErc721ContractDeployDto } from "@framework/types";

import ContractManagerSol from "@framework/core-contracts/artifacts/contracts/ContractManager/ContractManager.sol/ContractManager.json";
import ERC721SimpleSol from "@framework/core-contracts/artifacts/contracts/ERC721/ERC721Simple.sol/ERC721Simple.json";
import ERC721GradedSol from "@framework/core-contracts/artifacts/contracts/ERC721/ERC721Graded.sol/ERC721Graded.json";
// import ERC721RandomSol from "@framework/core-contracts/artifacts/contracts/ERC721/test/ERC721RandomTest.sol/ERC721RandomTest.json";
import ERC721RandomSol from "@framework/core-contracts/artifacts/contracts/ERC721/ERC721Random.sol/ERC721Random.json";
import { Erc721ContractDeployDialog } from "./deploy-dialog";

function getBytecodeByErc721TokenTemplate(template: Erc721ContractTemplate) {
  switch (template) {
    case Erc721ContractTemplate.SIMPLE:
      return ERC721SimpleSol.bytecode;
    case Erc721ContractTemplate.GRADED:
      return ERC721GradedSol.bytecode;
    case Erc721ContractTemplate.RANDOM:
      return ERC721RandomSol.bytecode;
    default:
      throw new Error("Unknown template");
  }
}

export interface IErc721TokenDeployButtonProps {
  className?: string;
}

export const Erc721TokenDeployButton: FC<IErc721TokenDeployButtonProps> = props => {
  const { className } = props;

  const { isDeployDialogOpen, handleDeployCancel, handleDeployConfirm, handleDeploy } = useDeploy(
    (props: IErc721ContractDeployDto & { sign: IServerSignature } & { web3Context: Web3ContextType }) => {
      const { contractTemplate, name, symbol, royalty, baseTokenURI, sign, web3Context } = props;

      const nonce = utils.arrayify(sign?.nonce);

      const contract = new Contract(
        process.env.CONTRACT_MANAGER_ADDR,
        ContractManagerSol.abi,
        web3Context.provider?.getSigner(),
      );

      return contract.deployERC721Token(
        nonce,
        getBytecodeByErc721TokenTemplate(contractTemplate),
        name,
        symbol,
        royalty,
        baseTokenURI,
        Object.keys(Erc721ContractTemplate).indexOf(contractTemplate),
        process.env.ACCOUNT,
        sign?.signature,
      ) as Promise<void>;
    },
  );

  const deployConfirm = (values: any, form: any) => {
    return handleDeployConfirm({
      url: "/contract-manager/erc721-token",
      method: "POST",
      data: values,
    }, form);
  };

  return (
    <Fragment>
      <Button
        variant="outlined"
        startIcon={<Add />}
        onClick={handleDeploy}
        data-testid="Erc721ContractDeployButton"
        className={className}
      >
        <FormattedMessage id="form.buttons.deploy" />
      </Button>
      <Erc721ContractDeployDialog
        onConfirm={deployConfirm}
        onCancel={handleDeployCancel}
        open={isDeployDialogOpen}
      />
    </Fragment>
  );
};
