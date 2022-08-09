import { FC, Fragment } from "react";
import { Button } from "@mui/material";
import { Add } from "@mui/icons-material";
import { FormattedMessage } from "react-intl";
import { Contract, utils } from "ethers";

import { useDeploy } from "@gemunion/react-hooks-eth";
import { Erc1155ContractFeatures, IErc1155ContractDeployDto } from "@framework/types";

import ContractManagerSol from "@framework/core-contracts/artifacts/contracts/ContractManager/ContractManager.sol/ContractManager.json";
import ERC1155SimpleSol from "@framework/core-contracts/artifacts/contracts/ERC1155/ERC1155Simple.sol/ERC1155Simple.json";
import ERC1155BlackListSol from "@framework/core-contracts/artifacts/contracts/ERC1155/ERC1155Blacklist.sol/ERC1155Blacklist.json";

import { Erc1155ContractDeployDialog } from "./deploy-dialog";

function getBytecodeByErc1155ContractFeatures(contractFeatures: Array<Erc1155ContractFeatures>) {
  if (!contractFeatures.length) {
    return ERC1155SimpleSol.bytecode;
  }

  if (contractFeatures.includes(Erc1155ContractFeatures.BLACKLIST)) {
    return ERC1155BlackListSol.bytecode;
  }

  throw new Error("Unsupported features combination");
}

export interface IErc1155TokenDeployButtonProps {
  className?: string;
}

export const Erc1155ContractDeployButton: FC<IErc1155TokenDeployButtonProps> = props => {
  const { className } = props;

  const { isDeployDialogOpen, handleDeployCancel, handleDeployConfirm, handleDeploy } = useDeploy(
    (values: IErc1155ContractDeployDto, web3Context, sign) => {
      const { contractFeatures, royalty, baseTokenURI } = values;

      const nonce = utils.arrayify(sign.nonce);
      const contract = new Contract(
        process.env.CONTRACT_MANAGER_ADDR,
        ContractManagerSol.abi,
        web3Context.provider?.getSigner(),
      );

      return contract.deployERC1155Token(
        nonce,
        getBytecodeByErc1155ContractFeatures(contractFeatures),
        royalty,
        baseTokenURI,
        contractFeatures.map(feature => Object.keys(Erc1155ContractFeatures).indexOf(feature)),
        process.env.ACCOUNT,
        sign.signature,
      ) as Promise<void>;
    },
  );

  const onDeployConfirm = (values: Record<string, any>, form: any) => {
    return handleDeployConfirm(
      {
        url: "/contract-manager/erc1155",
        method: "POST",
        data: values,
      },
      form,
    );
  };

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
      <Erc1155ContractDeployDialog
        onConfirm={onDeployConfirm}
        onCancel={handleDeployCancel}
        open={isDeployDialogOpen}
      />
    </Fragment>
  );
};
