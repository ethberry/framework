import { FC, Fragment } from "react";
import { Button } from "@mui/material";
import { Add } from "@mui/icons-material";
import { FormattedMessage } from "react-intl";
import { useWeb3React } from "@web3-react/core";
import { Contract, utils } from "ethers";

import { useApi } from "@gemunion/provider-api-firebase";
import { IServerSignature } from "@gemunion/types-collection";
import { useDeploy } from "@gemunion/react-hooks-eth";
import { Erc1155ContractTemplate, IUniContractDeployDto } from "@framework/types";

import ContractManagerSol from "@framework/core-contracts/artifacts/contracts/ContractManager/ContractManager.sol/ContractManager.json";
import ERC1155SimpleSol from "@framework/core-contracts/artifacts/contracts/ERC1155/ERC1155Simple.sol/ERC1155Simple.json";

import { Erc1155TokenDeployDialog } from "./deploy-dialog";

function getBytecodeByErc1155TokenTemplate(template: Erc1155ContractTemplate) {
  switch (template) {
    case Erc1155ContractTemplate.ERC1155_SIMPLE:
      return ERC1155SimpleSol.bytecode;
    default:
      throw new Error("Unknown template");
  }
}

export interface IErc1155TokenDeployButtonProps {
  className?: string;
}

export const Erc1155TokenDeployButton: FC<IErc1155TokenDeployButtonProps> = props => {
  const { className } = props;

  const { library } = useWeb3React();
  const api = useApi();

  const { isDeployDialogOpen, handleDeployCancel, handleDeployConfirm, handleDeploy } = useDeploy(
    (values: IUniContractDeployDto) => {
      const { contractTemplate, baseTokenURI } = values;

      return api
        .fetchJson({
          url: "/contract-manager/erc1155-token",
          method: "POST",
          data: values,
        })
        .then((sign: IServerSignature) => {
          const nonce = utils.arrayify(sign.nonce);
          const contract = new Contract(process.env.CONTRACT_MANAGER_ADDR, ContractManagerSol.abi, library.getSigner());

          return contract.deployERC1155Token(
            nonce,
            getBytecodeByErc1155TokenTemplate(contractTemplate),
            baseTokenURI,
            Object.keys(Erc1155ContractTemplate).indexOf(contractTemplate),
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
        data-testid="Erc1155ContractDeployButton"
        className={className}
      >
        <FormattedMessage id="form.buttons.deploy" />
      </Button>
      <Erc1155TokenDeployDialog
        onConfirm={handleDeployConfirm}
        onCancel={handleDeployCancel}
        open={isDeployDialogOpen}
      />
    </Fragment>
  );
};
