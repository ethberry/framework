import { FC, Fragment } from "react";
import { Button } from "@mui/material";
import { Add } from "@mui/icons-material";
import { FormattedMessage } from "react-intl";
import { Contract, utils } from "ethers";

import { useDeploy } from "@gemunion/react-hooks-eth";
import { Erc998ContractTemplate, IErc998ContractDeployDto } from "@framework/types";

import ContractManagerSol from "@framework/core-contracts/artifacts/contracts/ContractManager/ContractManager.sol/ContractManager.json";
import ERC998SimpleSol from "@framework/core-contracts/artifacts/contracts/ERC998/ERC998Simple.sol/ERC998Simple.json";
import ERC998UpgradeableSol from "@framework/core-contracts/artifacts/contracts/ERC998/ERC998Upgradeable.sol/ERC998Upgradeable.json";
import ERC998RandomSol from "@framework/core-contracts/artifacts/contracts/ERC998/ERC998Random.sol/ERC998Random.json";
import { Erc998ContractDeployDialog } from "./deploy-dialog";

function getBytecodeByErc998TokenTemplate(template: Erc998ContractTemplate) {
  switch (template) {
    case Erc998ContractTemplate.SIMPLE:
      return ERC998SimpleSol.bytecode;
    case Erc998ContractTemplate.UPGRADEABLE:
      return ERC998UpgradeableSol.bytecode;
    case Erc998ContractTemplate.RANDOM:
      return ERC998RandomSol.bytecode;
    default:
      throw new Error("Unknown template");
  }
}

export interface ITokenDeployButtonProps {
  className?: string;
}

export const Erc998TokenDeployButton: FC<ITokenDeployButtonProps> = props => {
  const { className } = props;

  const { isDeployDialogOpen, handleDeployCancel, handleDeployConfirm, handleDeploy } = useDeploy(
    (values: IErc998ContractDeployDto, web3Context, sign) => {
      const { contractTemplate, name, symbol, baseTokenURI, royalty } = values;

      const nonce = utils.arrayify(sign.nonce);
      const contract = new Contract(
        process.env.CONTRACT_MANAGER_ADDR,
        ContractManagerSol.abi,
        web3Context.provider?.getSigner(),
      );

      return contract.deployERC998Token(
        nonce,
        getBytecodeByErc998TokenTemplate(contractTemplate),
        name,
        symbol,
        royalty,
        baseTokenURI,
        Object.keys(Erc998ContractTemplate).indexOf(contractTemplate),
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
