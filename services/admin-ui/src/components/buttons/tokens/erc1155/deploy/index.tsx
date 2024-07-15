import { FC, Fragment } from "react";
import { Add } from "@mui/icons-material";
import { Contract, utils } from "ethers";
import { useWeb3React } from "@web3-react/core";

import { useDeploy } from "@gemunion/react-hooks-eth";
import { useUser } from "@gemunion/provider-user";
import { ListAction, ListActionVariant } from "@framework/styled";
import type { IContract, IErc1155ContractDeployDto, IUser } from "@framework/types";
import { Erc1155ContractTemplates } from "@framework/types";

import deployERC1155TokenERC1155FactoryFacetABI from "@framework/abis/json/ERC1155FactoryFacet/deployERC1155Token.json";

import { Erc1155ContractDeployDialog } from "./dialog";

export interface IErc1155TokenDeployButtonProps {
  className?: string;
  disabled?: boolean;
  variant?: ListActionVariant;
}

export const Erc1155ContractDeployButton: FC<IErc1155TokenDeployButtonProps> = props => {
  const { className, disabled, variant = ListActionVariant.button } = props;

  const { profile } = useUser<IUser>();
  const { chainId } = useWeb3React();
  // TOKEN URI WITH CHAIN_ID
  const tokenURI = `${process.env.JSON_URL}/metadata/${chainId ? chainId.toString() : "0"}`;

  const { isDeployDialogOpen, handleDeployCancel, handleDeployConfirm, handleDeploy } = useDeploy(
    (values: IErc1155ContractDeployDto, web3Context, sign, systemContract: IContract) => {
      const nonce = utils.arrayify(sign.nonce);
      const contract = new Contract(
        systemContract.address,
        deployERC1155TokenERC1155FactoryFacetABI,
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

  const onDeployConfirm = (values: Partial<IContract>, form: any) => {
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
      <ListAction
        onClick={handleDeploy}
        icon={Add}
        message="form.buttons.deploy"
        className={className}
        dataTestId="Erc1155ContractDeployButton"
        disabled={disabled}
        variant={variant}
      />
      <Erc1155ContractDeployDialog
        onConfirm={onDeployConfirm}
        onCancel={handleDeployCancel}
        open={isDeployDialogOpen}
        initialValues={{
          contractTemplate: Erc1155ContractTemplates.SIMPLE,
          baseTokenURI: tokenURI,
          royalty: 0,
        }}
      />
    </Fragment>
  );
};
