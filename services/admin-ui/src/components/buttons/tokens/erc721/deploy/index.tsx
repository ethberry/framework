import { FC, Fragment } from "react";
import { Add } from "@mui/icons-material";
import { Contract, utils } from "ethers";

import { useDeploy } from "@gemunion/react-hooks-eth";
import { useUser } from "@gemunion/provider-user";
import { ListAction, ListActionVariant } from "@framework/mui-lists";
import type { IErc721ContractDeployDto, IUser } from "@framework/types";
import { Erc721ContractTemplates } from "@framework/types";

import DeployERC721TokenABI from "../../../../../abis/hierarchy/erc721/contract-deploy/deployERC721Token.abi.json";

import { Erc721ContractDeployDialog } from "./dialog";

export interface IErc721ContractDeployButtonProps {
  className?: string;
  contractTemplate?: Erc721ContractTemplates;
  disabled?: boolean;
  variant?: ListActionVariant;
}

export const Erc721ContractDeployButton: FC<IErc721ContractDeployButtonProps> = props => {
  const {
    className,
    contractTemplate = Erc721ContractTemplates.SIMPLE,
    disabled,
    variant = ListActionVariant.button,
  } = props;

  const { profile } = useUser<IUser>();

  const { isDeployDialogOpen, handleDeployCancel, handleDeployConfirm, handleDeploy } = useDeploy(
    (values: IErc721ContractDeployDto, web3Context, sign) => {
      const nonce = utils.arrayify(sign.nonce);
      const contract = new Contract(
        process.env.CONTRACT_MANAGER_ADDR,
        DeployERC721TokenABI,
        web3Context.provider?.getSigner(),
      );

      return contract.deployERC721Token(
        {
          nonce,
          bytecode: sign.bytecode,
          externalId: profile.id,
        },
        // values,
        {
          contractTemplate: Object.values(Erc721ContractTemplates).indexOf(values.contractTemplate).toString(),
          name: values.name,
          symbol: values.symbol,
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
        url: "/contract-manager/erc721",
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
        dataTestId="Erc721ContractDeployButton"
        disabled={disabled}
        variant={variant}
      />
      <Erc721ContractDeployDialog
        onConfirm={onDeployConfirm}
        onCancel={handleDeployCancel}
        open={isDeployDialogOpen}
        initialValues={{
          contractTemplate,
          name: "",
          symbol: "",
          baseTokenURI: `${process.env.JSON_URL}/metadata`,
          royalty: 0,
        }}
      />
    </Fragment>
  );
};
