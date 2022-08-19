import { FC, Fragment } from "react";
import { Button } from "@mui/material";
import { Add } from "@mui/icons-material";
import { FormattedMessage } from "react-intl";
import { Contract, utils } from "ethers";

import { useDeploy } from "@gemunion/react-hooks-eth";
import { Erc998ContractFeatures, IErc998ContractDeployDto } from "@framework/types";

import ContractManagerSol from "@framework/core-contracts/artifacts/contracts/ContractManager/ContractManager.sol/ContractManager.json";

import { Erc998ContractDeployDialog } from "./deploy-dialog";

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
        // @ts-ignore
        sign.bytecode,
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
      <Erc998ContractDeployDialog
        onConfirm={onDeployConfirm}
        onCancel={handleDeployCancel}
        open={isDeployDialogOpen}
        initialValues={{
          contractFeatures: [],
          name: "",
          symbol: "",
          baseTokenURI: `${process.env.JSON_URL}/metadata`,
          royalty: 0,
        }}
      />
    </Fragment>
  );
};
