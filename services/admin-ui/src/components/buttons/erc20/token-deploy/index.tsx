import { FC, Fragment } from "react";
import { Button } from "@mui/material";
import { Add } from "@mui/icons-material";
import { FormattedMessage } from "react-intl";
import { useWeb3React } from "@web3-react/core";
import { Contract, utils } from "ethers";

import { useApi } from "@gemunion/provider-api";
import { IServerSignature } from "@gemunion/types-collection";
import { useDeploy } from "@gemunion/react-hooks-eth";
import { Erc20TokenTemplate, IErc20TokenDeployDto } from "@framework/types";

import ContractManagerSol from "@framework/core-contracts/artifacts/contracts/ContractManager/ContractManager.sol/ContractManager.json";
import ERC20SimpleSol from "@framework/core-contracts/artifacts/contracts/ERC20/ERC20Simple.sol/ERC20Simple.json";
import ERC20BlackListSol from "@framework/core-contracts/artifacts/contracts/ERC20/ERC20BlackList.sol/ERC20BlackList.json";

import { Erc20TokenDeployDialog } from "./deploy-dialog";

function getBytecodeByErc20TokenTemplate(template: Erc20TokenTemplate) {
  switch (template) {
    case Erc20TokenTemplate.SIMPLE:
      return ERC20SimpleSol.bytecode;
    case Erc20TokenTemplate.BLACKLIST:
      return ERC20BlackListSol.bytecode;
    default:
      throw new Error("Unknown template");
  }
}

export interface IErc20TokenDeployButtonProps {
  className?: string;
}

export const Erc20TokenDeployButton: FC<IErc20TokenDeployButtonProps> = props => {
  const { className } = props;

  const { library } = useWeb3React();
  const api = useApi();

  const { isDeployDialogOpen, handleDeployCancel, handleDeployConfirm, handleDeploy } = useDeploy(
    (values: IErc20TokenDeployDto) => {
      const { contractTemplate, name, symbol, cap } = values;

      return api
        .fetchJson({
          url: "/contract-manager/erc20-token",
          method: "POST",
          data: values,
        })
        .then((sign: IServerSignature) => {
          const nonce = utils.arrayify(sign.nonce);
          const contract = new Contract(process.env.CONTRACT_MANAGER_ADDR, ContractManagerSol.abi, library.getSigner());
          return contract.deployERC20Token(
            nonce,
            getBytecodeByErc20TokenTemplate(contractTemplate),
            name,
            symbol,
            cap,
            Object.keys(Erc20TokenTemplate).indexOf(contractTemplate),
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
        data-testid="Erc20TokenDeployButton"
        className={className}
      >
        <FormattedMessage id="form.buttons.add" />
      </Button>
      <Erc20TokenDeployDialog onConfirm={handleDeployConfirm} onCancel={handleDeployCancel} open={isDeployDialogOpen} />
    </Fragment>
  );
};
