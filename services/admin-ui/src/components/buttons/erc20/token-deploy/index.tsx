import { FC, Fragment } from "react";
import { Button } from "@mui/material";
import { Add } from "@mui/icons-material";
import { FormattedMessage } from "react-intl";
import { useWeb3React } from "@web3-react/core";
import { ethers } from "ethers";

import { useApi } from "@gemunion/provider-api";
import { Erc20TokenTemplate, IErc20TokenDeployDto, IServerSignature } from "@framework/types";
import ContractManager from "@framework/binance-contracts/artifacts/contracts/ContractManager/ContractManager.sol/ContractManager.json";
import ERC20Simple from "@framework/binance-contracts/artifacts/contracts/ERC20/ERC20Simple.sol/ERC20Simple.json";
import ERC20BlackList from "@framework/binance-contracts/artifacts/contracts/ERC20/ERC20BlackList.sol/ERC20BlackList.json";

import { Erc20TokenDeployDialog } from "./deploy-dialog";
import { useDeploy } from "../../../hooks/useDeploy";

function getBytecodeByErc20TokenTemplate(template: Erc20TokenTemplate) {
  switch (template) {
    case Erc20TokenTemplate.SIMPLE:
      return ERC20Simple.bytecode;
    case Erc20TokenTemplate.BLACKLIST:
      return ERC20BlackList.bytecode;
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
          const nonce = ethers.utils.arrayify(sign.nonce);
          const contract = new ethers.Contract(
            process.env.CONTRACT_MANAGER_ADDR,
            ContractManager.abi,
            library.getSigner(),
          );
          return contract.deployERC20Token(
            nonce,
            getBytecodeByErc20TokenTemplate(contractTemplate),
            name,
            symbol,
            cap,
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
        data-testid="erc20TokenDeployButton"
        className={className}
      >
        <FormattedMessage id="form.buttons.add" />
      </Button>
      <Erc20TokenDeployDialog onConfirm={handleDeployConfirm} onCancel={handleDeployCancel} open={isDeployDialogOpen} />
    </Fragment>
  );
};
