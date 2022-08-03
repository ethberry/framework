import { FC, Fragment } from "react";
import { Button } from "@mui/material";
import { Add } from "@mui/icons-material";
import { FormattedMessage } from "react-intl";
import { Contract, utils } from "ethers";

import { useDeploy } from "@gemunion/react-hooks-eth";
import { Erc20ContractTemplate, IErc20TokenDeployDto } from "@framework/types";

import ContractManagerSol from "@framework/core-contracts/artifacts/contracts/ContractManager/ContractManager.sol/ContractManager.json";
import ERC20SimpleSol from "@framework/core-contracts/artifacts/contracts/ERC20/ERC20Simple.sol/ERC20Simple.json";
import ERC20BlacklistSol from "@framework/core-contracts/artifacts/contracts/ERC20/ERC20Blacklist.sol/ERC20Blacklist.json";

import { Erc20ContractDeployDialog } from "./deploy-dialog";

function getBytecodeByErc20TokenTemplate(template: Erc20ContractTemplate) {
  switch (template) {
    case Erc20ContractTemplate.SIMPLE:
      return ERC20SimpleSol.bytecode;
    case Erc20ContractTemplate.BLACKLIST:
      return ERC20BlacklistSol.bytecode;
    default:
      throw new Error("Unknown template");
  }
}

export interface IErc20TokenDeployButtonProps {
  className?: string;
}

export const Erc20TokenDeployButton: FC<IErc20TokenDeployButtonProps> = props => {
  const { className } = props;

  const { isDeployDialogOpen, handleDeployCancel, handleDeployConfirm, handleDeploy } = useDeploy(
    (values: IErc20TokenDeployDto, web3Context, sign) => {
      const { contractTemplate, name, symbol, cap } = values;

      const nonce = utils.arrayify(sign.nonce);
      const contract = new Contract(
        process.env.CONTRACT_MANAGER_ADDR,
        ContractManagerSol.abi,
        web3Context.provider?.getSigner(),
      );

      return contract.deployERC20Token(
        nonce,
        getBytecodeByErc20TokenTemplate(contractTemplate),
        name,
        symbol,
        cap,
        Object.keys(Erc20ContractTemplate).indexOf(contractTemplate),
        process.env.ACCOUNT,
        sign.signature,
      ) as Promise<void>;
    },
  );

  const onDeployConfirm = (values: Record<string, any>, form: any) => {
    return handleDeployConfirm(
      {
        url: "/contract-manager/erc20",
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
        data-testid="Erc20ContractDeployButton"
        className={className}
      >
        <FormattedMessage id="form.buttons.deploy" />
      </Button>
      <Erc20ContractDeployDialog onConfirm={onDeployConfirm} onCancel={handleDeployCancel} open={isDeployDialogOpen} />
    </Fragment>
  );
};
