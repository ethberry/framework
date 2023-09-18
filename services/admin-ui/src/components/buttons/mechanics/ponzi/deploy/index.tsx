import { FC, Fragment } from "react";
import { Add } from "@mui/icons-material";
import { Contract, utils } from "ethers";

import { useDeploy } from "@gemunion/react-hooks-eth";
import { useUser } from "@gemunion/provider-user";
import { ListAction, ListActionVariant } from "@framework/mui-lists";
import type { IPonziContractDeployDto, IUser } from "@framework/types";
import { PonziContractTemplates } from "@framework/types";

import DeployPonziABI from "../../../../../abis/mechanics/ponzi/deploy/deployPonzi.abi.json";

import { PonziContractDeployDialog } from "./dialog";

export interface IPonziContractDeployButtonProps {
  disabled?: boolean;
  variant?: ListActionVariant;
}

export const PonziDeployButton: FC<IPonziContractDeployButtonProps> = props => {
  const { disabled, variant = ListActionVariant.button } = props;

  const { profile } = useUser<IUser>();

  const { isDeployDialogOpen, handleDeployCancel, handleDeployConfirm, handleDeploy } = useDeploy(
    (values: IPonziContractDeployDto, web3Context, sign) => {
      const nonce = utils.arrayify(sign.nonce);
      const contract = new Contract(
        process.env.CONTRACT_MANAGER_ADDR,
        DeployPonziABI,
        web3Context.provider?.getSigner(),
      );

      return contract.deployPonzi(
        {
          nonce,
          bytecode: sign.bytecode,
          externalId: profile.id,
        },
        // values,
        {
          payees: values.payees,
          shares: values.shares,
          contractTemplate: Object.values(PonziContractTemplates).indexOf(values.contractTemplate).toString(),
        },
        sign.signature,
      ) as Promise<void>;
    },
  );

  const onDeployConfirm = (values: Record<string, any>, form: any) => {
    return handleDeployConfirm(
      {
        url: "/contract-manager/ponzi",
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
      <ListAction
        onClick={handleDeploy}
        icon={Add}
        message="form.buttons.deploy"
        dataTestId="PonziContractDeployButton"
        disabled={disabled}
        variant={variant}
      />
      <PonziContractDeployDialog onConfirm={onDeployConfirm} onCancel={handleDeployCancel} open={isDeployDialogOpen} />
    </Fragment>
  );
};
