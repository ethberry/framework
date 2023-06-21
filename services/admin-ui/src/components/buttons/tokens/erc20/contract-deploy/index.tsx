import { FC, Fragment } from "react";
import { Button } from "@mui/material";
import { Add } from "@mui/icons-material";
import { FormattedMessage } from "react-intl";
import { constants, Contract, utils } from "ethers";

import { useDeploy } from "@gemunion/react-hooks-eth";
import { useUser } from "@gemunion/provider-user";
import type { IErc20TokenDeployDto, IUser } from "@framework/types";
import { Erc20ContractTemplates } from "@framework/types";

import ERC20DeployERC20TokenABI from "../../../../../abis/hierarchy/erc20/contract-deploy/deployERC20Token.abi.json";

import { Erc20ContractDeployDialog } from "./deploy-dialog";

export interface IErc20ContractDeployButtonProps {
  className?: string;
}

export const Erc20ContractDeployButton: FC<IErc20ContractDeployButtonProps> = props => {
  const { className } = props;

  const user = useUser<IUser>();

  const { isDeployDialogOpen, handleDeployCancel, handleDeployConfirm, handleDeploy } = useDeploy(
    (values: IErc20TokenDeployDto, web3Context, sign) => {
      const nonce = utils.arrayify(sign.nonce);
      const contract = new Contract(
        process.env.CONTRACT_MANAGER_ADDR,
        ERC20DeployERC20TokenABI,
        web3Context.provider?.getSigner(),
      );

      return contract.deployERC20Token(
        {
          nonce,
          bytecode: sign.bytecode,
          externalId: user.profile.id,
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
      <Button
        variant="outlined"
        startIcon={<Add />}
        onClick={handleDeploy}
        data-testid="Erc20ContractDeployButton"
        className={className}
      >
        <FormattedMessage id="form.buttons.deploy" />
      </Button>
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
