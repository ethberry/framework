import { FC, Fragment } from "react";
import { Button } from "@mui/material";
import { Add } from "@mui/icons-material";
import { FormattedMessage } from "react-intl";
import { Contract, utils } from "ethers";

import { useDeploy } from "@gemunion/react-hooks-eth";
import { Erc721ContractFeatures, IErc721ContractDeployDto } from "@framework/types";

import ContractManagerSol from "@framework/core-contracts/artifacts/contracts/ContractManager/ContractManager.sol/ContractManager.json";
import ERC721BlackListSol from "@framework/core-contracts/artifacts/contracts/ERC721/ERC721Blacklist.sol/ERC721Blacklist.json";
import ERC721FullSol from "@framework/core-contracts/artifacts/contracts/ERC721/ERC721Full.sol/ERC721Full.json";
import ERC721RandomSol from "@framework/core-contracts/artifacts/contracts/ERC721/ERC721Random.sol/ERC721Random.json";
import ERC721RandomBlacklistSol from "@framework/core-contracts/artifacts/contracts/ERC721/ERC721RandomBlacklist.sol/ERC721RandomBlacklist.json";
import ERC721SimpleSol from "@framework/core-contracts/artifacts/contracts/ERC721/ERC721Simple.sol/ERC721Simple.json";
import ERC721UpgradeableSol from "@framework/core-contracts/artifacts/contracts/ERC721/ERC721Upgradeable.sol/ERC721Upgradeable.json";
import ERC721UpgradeableBlacklistSol from "@framework/core-contracts/artifacts/contracts/ERC721/ERC721UpgradeableBlacklist.sol/ERC721UpgradeableBlacklist.json";
import ERC721UpgradeableRandomSol from "@framework/core-contracts/artifacts/contracts/ERC721/ERC721UpgradeableRandom.sol/ERC721UpgradeableRandom.json";

import { Erc721ContractDeployDialog } from "./deploy-dialog";

function getBytecodeByErc721ContractFeatures(contractFeatures: Array<Erc721ContractFeatures>) {
  if (!contractFeatures.length) {
    return ERC721SimpleSol.bytecode;
  }

  if (
    contractFeatures.includes(Erc721ContractFeatures.UPGRADEABLE) &&
    contractFeatures.includes(Erc721ContractFeatures.RANDOM) &&
    contractFeatures.includes(Erc721ContractFeatures.BLACKLIST)
  ) {
    return ERC721FullSol.bytecode;
  }

  if (
    contractFeatures.includes(Erc721ContractFeatures.UPGRADEABLE) &&
    contractFeatures.includes(Erc721ContractFeatures.RANDOM)
  ) {
    return ERC721UpgradeableRandomSol.bytecode;
  }

  if (
    contractFeatures.includes(Erc721ContractFeatures.UPGRADEABLE) &&
    contractFeatures.includes(Erc721ContractFeatures.BLACKLIST)
  ) {
    return ERC721UpgradeableBlacklistSol.bytecode;
  }

  if (
    contractFeatures.includes(Erc721ContractFeatures.RANDOM) &&
    contractFeatures.includes(Erc721ContractFeatures.BLACKLIST)
  ) {
    return ERC721RandomBlacklistSol.bytecode;
  }

  if (contractFeatures.includes(Erc721ContractFeatures.RANDOM)) {
    return ERC721RandomSol.bytecode;
  }

  if (contractFeatures.includes(Erc721ContractFeatures.UPGRADEABLE)) {
    return ERC721UpgradeableSol.bytecode;
  }

  if (contractFeatures.includes(Erc721ContractFeatures.BLACKLIST)) {
    return ERC721BlackListSol.bytecode;
  }

  throw new Error("Unsupported features combination");
}

export interface IErc721TokenDeployButtonProps {
  className?: string;
}

export const Erc721TokenDeployButton: FC<IErc721TokenDeployButtonProps> = props => {
  const { className } = props;

  const { isDeployDialogOpen, handleDeployCancel, handleDeployConfirm, handleDeploy } = useDeploy(
    (values: IErc721ContractDeployDto, web3Context, sign) => {
      const { contractFeatures, name, symbol, royalty, baseTokenURI } = values;

      const nonce = utils.arrayify(sign.nonce);
      const contract = new Contract(
        process.env.CONTRACT_MANAGER_ADDR,
        ContractManagerSol.abi,
        web3Context.provider?.getSigner(),
      );

      return contract.deployERC721Token(
        nonce,
        getBytecodeByErc721ContractFeatures(contractFeatures),
        name,
        symbol,
        royalty,
        baseTokenURI,
        contractFeatures.map(feature => Object.keys(Erc721ContractFeatures).indexOf(feature)),
        process.env.ACCOUNT,
        sign.signature,
      ) as Promise<void>;
    },
  );

  const onDeployConfirm = (values: Record<string, any>, form: any) => {
    return handleDeployConfirm(
      {
        url: "/contract-manager/erc721",
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
        data-testid="Erc721ContractDeployButton"
        className={className}
      >
        <FormattedMessage id="form.buttons.deploy" />
      </Button>
      <Erc721ContractDeployDialog onConfirm={onDeployConfirm} onCancel={handleDeployCancel} open={isDeployDialogOpen} />
    </Fragment>
  );
};
