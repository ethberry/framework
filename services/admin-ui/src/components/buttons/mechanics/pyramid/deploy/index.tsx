import { FC, Fragment } from "react";
import { Button } from "@mui/material";
import { Add } from "@mui/icons-material";
import { FormattedMessage } from "react-intl";
import { Contract, utils } from "ethers";

import { useDeploy } from "@gemunion/react-hooks-eth";
import type { IPyramidContractDeployDto } from "@framework/types";
import { PyramidContractFeatures } from "@framework/types";

import ContractManagerSol from "@framework/core-contracts/artifacts/contracts/ContractManager/ContractManager.sol/ContractManager.json";

import { PyramidContractDeployDialog } from "./dialog";

export interface IPyramidContractDeployButtonProps {
  className?: string;
}

export const PyramidContractDeployButton: FC<IPyramidContractDeployButtonProps> = props => {
  const { className } = props;

  const { isDeployDialogOpen, handleDeployCancel, handleDeployConfirm, handleDeploy } = useDeploy(
    (values: IPyramidContractDeployDto, web3Context, sign) => {
      const { contractFeatures } = values;

      const nonce = utils.arrayify(sign.nonce);
      const contract = new Contract(
        process.env.CONTRACT_MANAGER_ADDR,
        ContractManagerSol.abi,
        web3Context.provider?.getSigner(),
      );

      // return contract.deployPyramid(
      //   nonce,
      //   sign.bytecode,
      //   contractFeatures.map(feature => Object.keys(PyramidContractFeatures).indexOf(feature)),
      //   process.env.ACCOUNT,
      //   sign.signature,
      // ) as Promise<void>;
      return contract.deployPyramid(
        {
          signer: process.env.ACCOUNT,
          signature: sign.signature,
        },
        {
          bytecode: sign.bytecode,
          featureIds: contractFeatures.map(feature => Object.keys(PyramidContractFeatures).indexOf(feature)),
          nonce,
        },
      ) as Promise<void>;
    },
  );

  const onDeployConfirm = (values: Record<string, any>, form: any) => {
    return handleDeployConfirm(
      {
        url: "/contract-manager/pyramid",
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
        data-testid="PyramidContractDeployButton"
        className={className}
      >
        <FormattedMessage id="form.buttons.deploy" />
      </Button>
      <PyramidContractDeployDialog
        onConfirm={onDeployConfirm}
        onCancel={handleDeployCancel}
        open={isDeployDialogOpen}
        initialValues={{
          contractFeatures: [PyramidContractFeatures.LINEAR_REFERRAL],
        }}
      />
    </Fragment>
  );
};
