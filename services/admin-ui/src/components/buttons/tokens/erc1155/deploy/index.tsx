import { FC, Fragment } from "react";
import { Button } from "@mui/material";
import { Add } from "@mui/icons-material";
import { FormattedMessage } from "react-intl";
import { Contract, utils } from "ethers";

import { useDeploy } from "@gemunion/react-hooks-eth";
import { useUser } from "@gemunion/provider-user";
import type { IErc1155ContractDeployDto, IUser } from "@framework/types";
import { Erc1155ContractTemplates } from "@framework/types";

import DeployERC1155TokenABI from "../../../../../abis/hierarchy/erc1155/contract-deploy/deployERC1155Token.abi.json";

import { Erc1155ContractDeployDialog } from "./dialog";

export interface IErc1155TokenDeployButtonProps {
  className?: string;
}

export const Erc1155ContractDeployButton: FC<IErc1155TokenDeployButtonProps> = props => {
  const { className } = props;

  const { profile } = useUser<IUser>();

  const { isDeployDialogOpen, handleDeployCancel, handleDeployConfirm, handleDeploy } = useDeploy(
    (values: IErc1155ContractDeployDto, web3Context, sign) => {
      const nonce = utils.arrayify(sign.nonce);
      const contract = new Contract(
        process.env.CONTRACT_MANAGER_ADDR,
        DeployERC1155TokenABI,
        web3Context.provider?.getSigner(),
      );

      return contract.deployERC1155Token(
        {
          nonce,
          bytecode: sign.bytecode,
          externalId: profile.id,
        },
        // values,
        {
          contractTemplate: Object.values(Erc1155ContractTemplates).indexOf(values.contractTemplate).toString(),
          baseTokenURI: values.baseTokenURI,
          royalty: values.royalty,
        },
        sign.signature,
      ) as Promise<void>;
    },
  );

  const onDeployConfirm = (values: Record<string, any>, form: any) => {
    return handleDeployConfirm(
      {
        url: "/contract-manager/erc1155",
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
        data-testid="Erc1155ContractDeployButton"
        className={className}
      >
        <FormattedMessage id="form.buttons.deploy" />
      </Button>
      <Erc1155ContractDeployDialog
        onConfirm={onDeployConfirm}
        onCancel={handleDeployCancel}
        open={isDeployDialogOpen}
        initialValues={{
          contractTemplate: Erc1155ContractTemplates.SIMPLE,
          baseTokenURI: `${process.env.JSON_URL}/metadata`,
          royalty: 0,
        }}
      />
    </Fragment>
  );
};
