import { FC, Fragment } from "react";
import { Button } from "@mui/material";
import { Add } from "@mui/icons-material";
import { FormattedMessage } from "react-intl";
import { Contract, utils } from "ethers";

import { useDeploy } from "@gemunion/react-hooks-eth";
import { Erc721ContractFeatures, IErc721ContractDeployDto } from "@framework/types";

import ContractManagerSol from "@framework/core-contracts/artifacts/contracts/ContractManager/ContractManager.sol/ContractManager.json";

import { Erc721ContractDeployDialog } from "./deploy-dialog";

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
        // @ts-ignore
        sign.bytecode,
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
