import { FC, Fragment } from "react";
import { Button } from "@mui/material";
import { Add } from "@mui/icons-material";
import { FormattedMessage } from "react-intl";
import { Contract, utils } from "ethers";

import { useDeploy } from "@gemunion/react-hooks-eth";
import { Erc998ContractFeatures, IErc998ContractDeployDto } from "@framework/types";

import ContractManagerSol from "@framework/core-contracts/artifacts/contracts/ContractManager/ContractManager.sol/ContractManager.json";
import ERC998FullSol from "@framework/core-contracts/artifacts/contracts/ERC998/ERC998Full.sol/ERC998Full.json";
import ERC998SimpleSol from "@framework/core-contracts/artifacts/contracts/ERC998/ERC998Simple.sol/ERC998Simple.json";
import ERC998BlackListSol from "@framework/core-contracts/artifacts/contracts/ERC998/ERC998Blacklist.sol/ERC998Blacklist.json";
import ERC998UpgradeableSol from "@framework/core-contracts/artifacts/contracts/ERC998/ERC998Upgradeable.sol/ERC998Upgradeable.json";
import ERC998UpgradeableRandomSol from "@framework/core-contracts/artifacts/contracts/ERC998/ERC998UpgradeableRandom.sol/ERC998UpgradeableRandom.json";

import { Erc998ContractDeployDialog } from "./deploy-dialog";

function getBytecodeByErc998ContractFeatures(contractFeatures: Array<Erc998ContractFeatures>) {
  if (!contractFeatures.length) {
    return ERC998SimpleSol.bytecode;
  }

  if (
    contractFeatures.includes(Erc998ContractFeatures.UPGRADEABLE) &&
    contractFeatures.includes(Erc998ContractFeatures.RANDOM) &&
    contractFeatures.includes(Erc998ContractFeatures.BLACKLIST)
  ) {
    return ERC998FullSol.bytecode;
  }

  if (
    contractFeatures.includes(Erc998ContractFeatures.UPGRADEABLE) &&
    contractFeatures.includes(Erc998ContractFeatures.RANDOM)
  ) {
    return ERC998UpgradeableRandomSol.bytecode;
  }

  if (contractFeatures.includes(Erc998ContractFeatures.UPGRADEABLE)) {
    return ERC998UpgradeableSol.bytecode;
  }

  if (contractFeatures.includes(Erc998ContractFeatures.BLACKLIST)) {
    return ERC998BlackListSol.bytecode;
  }

  throw new Error("Unsupported features combination");
}

export interface IErc998ContractDeployButtonProps {
  className?: string;
}

export const Erc998ContractDeployButton: FC<IErc998ContractDeployButtonProps> = props => {
  const { className } = props;

  const { isDeployDialogOpen, handleDeployCancel, handleDeployConfirm, handleDeploy } = useDeploy(
    (values: IErc998ContractDeployDto, web3Context, sign) => {
      const { contractFeatures, name, symbol, baseTokenURI, royalty } = values;

      const nonce = utils.arrayify(sign.nonce);
      const contract = new Contract(
        process.env.CONTRACT_MANAGER_ADDR,
        ContractManagerSol.abi,
        web3Context.provider?.getSigner(),
      );

      return contract.deployERC998Token(
        nonce,
        getBytecodeByErc998ContractFeatures(contractFeatures),
        name,
        symbol,
        royalty,
        baseTokenURI,
        contractFeatures.map(feature => Object.keys(Erc998ContractFeatures).indexOf(feature)),
        process.env.ACCOUNT,
        sign.signature,
      ) as Promise<void>;
    },
  );

  const onDeployConfirm = (values: Record<string, any>, form: any) => {
    return handleDeployConfirm(
      {
        url: "/contract-manager/erc998",
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
        data-testid="Erc998TokenDeployButton"
        className={className}
      >
        <FormattedMessage id="form.buttons.deploy" />
      </Button>
      <Erc998ContractDeployDialog onConfirm={onDeployConfirm} onCancel={handleDeployCancel} open={isDeployDialogOpen} />
    </Fragment>
  );
};
