import { FC, Fragment } from "react";
import { Add } from "@mui/icons-material";
import { Contract, utils } from "ethers";

import { useDeploy } from "@gemunion/react-hooks-eth";
import { useUser } from "@gemunion/provider-user";
import { ListAction, ListActionVariant } from "@framework/styled";
import type { IContract, IPredictionContractDeployDto, IUser } from "@framework/types";
import { PredictionContractTemplates } from "@framework/types";

import { PredictionContractDeployDialog } from "./dialog";
import PredictionFactoryFacetDeployPredictionABI from "@framework/abis/json/PredictionFactoryFacet/deployPrediction.json";

export interface IPredictionContractDeployButtonProps {
  className?: string;
  disabled?: boolean;
  variant?: ListActionVariant;
}

export const PredictionContractDeployButton: FC<IPredictionContractDeployButtonProps> = props => {
  const { className, disabled, variant = ListActionVariant.button } = props;

  const { profile } = useUser<IUser>();

  const { isDeployDialogOpen, handleDeployCancel, handleDeployConfirm, handleDeploy } = useDeploy(
    (values: IPredictionContractDeployDto, web3Context, sign, systemContract: IContract) => {
      const nonce = utils.arrayify(sign.nonce);
      const contract = new Contract(
        systemContract.address,
        PredictionFactoryFacetDeployPredictionABI,
        web3Context.provider?.getSigner(),
      );

      return contract.deployPrediction(
        {
          nonce,
          bytecode: sign.bytecode,
          externalId: profile.id,
        },
        // values,
        {
          contractTemplate: Object.values(PredictionContractTemplates).indexOf(values.contractTemplate).toString(),
        },
        sign.signature,
      ) as Promise<void>;
    },
  );

  const onDeployConfirm = (values: Record<string, any>, form: any) => {
    return handleDeployConfirm(
      {
        url: "/contract-manager/prediction",
        method: "POST",
        data: {
          contractTemplate: values.contractTemplate,
        },
      },
      form,
    );
  };

  return (
    <Fragment>
      <ListAction
        onClick={handleDeploy}
        icon={Add}
        message="form.buttons.deploy"
        className={className}
        dataTestId="PredictionContractDeployButton"
        disabled={disabled}
        variant={variant}
      />
      <PredictionContractDeployDialog
        onConfirm={onDeployConfirm}
        onCancel={handleDeployCancel}
        open={isDeployDialogOpen}
      />
    </Fragment>
  );
};
