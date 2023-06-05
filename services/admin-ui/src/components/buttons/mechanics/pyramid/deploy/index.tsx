import { FC, Fragment } from "react";
import { Button } from "@mui/material";
import { Add } from "@mui/icons-material";
import { FormattedMessage } from "react-intl";
import { Contract, utils } from "ethers";

import type { IPyramidContractDeployDto } from "@framework/types";
import { PyramidContractTemplates } from "@framework/types";
import { useDeploy } from "@gemunion/react-hooks-eth";

import PyramidDeployPyramidABI from "../../../../../abis/mechanics/pyramid/deploy/deployPyramid.abi.json";

import { PyramidContractDeployDialog } from "./dialog";

export interface IPyramidContractDeployButtonProps {
  className?: string;
}

export const PyramidDeployButton: FC<IPyramidContractDeployButtonProps> = props => {
  const { className } = props;

  const { isDeployDialogOpen, handleDeployCancel, handleDeployConfirm, handleDeploy } = useDeploy(
    (values: IPyramidContractDeployDto, web3Context, sign) => {
      const nonce = utils.arrayify(sign.nonce);
      const contract = new Contract(
        process.env.CONTRACT_MANAGER_ADDR,
        PyramidDeployPyramidABI,
        web3Context.provider?.getSigner(),
      );

      return contract.deployPyramid(
        {
          nonce,
          bytecode: sign.bytecode,
        },
        // values,
        {
          payees: values.payees,
          shares: values.shares,
          contractTemplate: Object.values(PyramidContractTemplates).indexOf(values.contractTemplate).toString(),
        },
        sign.signature,
      ) as Promise<void>;
    },
  );

  const onDeployConfirm = (values: Record<string, any>, form: any) => {
    return handleDeployConfirm(
      {
        url: "/contract-manager/pyramid",
        method: "POST",
        data: {
          contractTemplate: values.contractTemplate,
          payees: values.shares.map(({ payee }: { payee: string }) => payee),
          shares: values.shares.map(({ share }: { share: number }) => share),
        },
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
      />
    </Fragment>
  );
};
