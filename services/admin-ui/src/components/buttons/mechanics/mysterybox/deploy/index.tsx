import { FC, Fragment } from "react";
import { Button } from "@mui/material";
import { Add } from "@mui/icons-material";
import { FormattedMessage } from "react-intl";
import { Contract, utils } from "ethers";

import { useDeploy } from "@gemunion/react-hooks-eth";
import type { IMysteryContractDeployDto } from "@framework/types";
import { MysteryContractFeatures } from "@framework/types";

import ContractManagerSol from "@framework/core-contracts/artifacts/contracts/ContractManager/ContractManager.sol/ContractManager.json";

import { MysteryContractDeployDialog } from "./dialog";

export interface IMysteryContractDeployButtonProps {
  className?: string;
}

export const MysteryContractDeployButton: FC<IMysteryContractDeployButtonProps> = props => {
  const { className } = props;

  const { isDeployDialogOpen, handleDeployCancel, handleDeployConfirm, handleDeploy } = useDeploy(
    (values: IMysteryContractDeployDto, web3Context, sign) => {
      const { contractFeatures, name, symbol, royalty, baseTokenURI } = values;

      const nonce = utils.arrayify(sign.nonce);
      const contract = new Contract(
        process.env.CONTRACT_MANAGER_ADDR,
        ContractManagerSol.abi,
        web3Context.provider?.getSigner(),
      );
      return contract.deployMysterybox(
        nonce,
        sign.bytecode,
        name,
        symbol,
        royalty,
        baseTokenURI,
        contractFeatures.map(feature => Object.keys(MysteryContractFeatures).indexOf(feature)),
        process.env.ACCOUNT,
        sign.signature,
      ) as Promise<void>;
    },
  );

  const onDeployConfirm = (values: Record<string, any>, form: any) => {
    return handleDeployConfirm(
      {
        url: "/contract-manager/mysterybox",
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
        data-testid="MysteryContractDeployButton"
        className={className}
      >
        <FormattedMessage id="form.buttons.deploy" />
      </Button>
      <MysteryContractDeployDialog
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
