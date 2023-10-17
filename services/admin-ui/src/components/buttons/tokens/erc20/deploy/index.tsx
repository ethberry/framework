import { FC, Fragment } from "react";
import { Add } from "@mui/icons-material";
import { constants, Contract, utils } from "ethers";

import { useDeploy } from "@gemunion/react-hooks-eth";
import { useUser } from "@gemunion/provider-user";
import { ListAction, ListActionVariant } from "@framework/mui-lists";
import type { IContract, IErc20TokenDeployDto, IUser } from "@framework/types";
import { Erc20ContractTemplates } from "@framework/types";

import DeployERC20TokenABI from "../../../../../abis/hierarchy/erc20/contract-deploy/deployERC20Token.abi.json";

import { Erc20ContractDeployDialog } from "./dialog";

export interface IErc20ContractDeployButtonProps {
  className?: string;
  disabled?: boolean;
  variant?: ListActionVariant;
}

export const Erc20ContractDeployButton: FC<IErc20ContractDeployButtonProps> = props => {
  const { className, disabled, variant = ListActionVariant.button } = props;

  const { profile } = useUser<IUser>();

  const { isDeployDialogOpen, handleDeployCancel, handleDeployConfirm, handleDeploy } = useDeploy(
    (values: IErc20TokenDeployDto, web3Context, sign, systemContract: IContract) => {
      const nonce = utils.arrayify(sign.nonce);
      const contract = new Contract(systemContract.address, DeployERC20TokenABI, web3Context.provider?.getSigner());

      return contract.deployERC20Token(
        {
          nonce,
          bytecode: sign.bytecode,
          externalId: profile.id,
        },
        // values,
        {
          contractTemplate: Object.values(Erc20ContractTemplates).indexOf(values.contractTemplate).toString(),
          name: values.name,
          symbol: values.symbol,
          cap: values.cap,
        },
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
      <ListAction
        onClick={handleDeploy}
        icon={Add}
        message="form.buttons.deploy"
        className={className}
        dataTestId="Erc20ContractDeployButton"
        disabled={disabled}
        variant={variant}
      />
      <Erc20ContractDeployDialog
        onConfirm={onDeployConfirm}
        onCancel={handleDeployCancel}
        open={isDeployDialogOpen}
        initialValues={{
          contractTemplate: Erc20ContractTemplates.SIMPLE,
          name: "",
          symbol: "",
          cap: constants.WeiPerEther.mul(1e6).toString(),
        }}
      />
    </Fragment>
  );
};
