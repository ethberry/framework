import { FC, Fragment } from "react";
import { Button } from "@mui/material";
import { Add } from "@mui/icons-material";
import { FormattedMessage } from "react-intl";
import { useWeb3React } from "@web3-react/core";
import { ethers } from "ethers";

import { useApi } from "@gemunion/provider-api";
import { Erc1155TokenTemplate, IErc1155TokenDeployDto, IServerSignature } from "@framework/types";
import ContractManager from "@framework/binance-contracts/artifacts/contracts/ContractManager/ContractManager.sol/ContractManager.json";
import ERC1155Simple from "@framework/binance-contracts/artifacts/contracts/ERC1155/ERC1155Simple.sol/ERC1155Simple.json";

import { Erc1155TokenDeployDialog } from "./deploy-dialog";
import { useDeploy } from "../../../hooks/useDeploy";

function getBytecodeByErc1155TokenTemplate(template: Erc1155TokenTemplate) {
  switch (template) {
    case Erc1155TokenTemplate.SIMPLE:
      return ERC1155Simple.bytecode;
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
    (values: IErc1155TokenDeployDto) => {
      const { contractTemplate, baseTokenURI } = values;

      return api
        .fetchJson({
          url: "/contract-manager/erc1155-token",
          method: "POST",
          data: values,
        })
        .then((sign: IServerSignature) => {
          const nonce = ethers.utils.arrayify(sign.nonce);
          const contract = new ethers.Contract(
            process.env.CONTRACT_MANAGER_ADDR,
            ContractManager.abi,
            library.getSigner(),
          );

          return contract.deployERC1155Token(
            nonce,
            getBytecodeByErc1155TokenTemplate(contractTemplate),
            baseTokenURI,
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
