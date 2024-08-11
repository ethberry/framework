import { FC, Fragment } from "react";
import { Add } from "@mui/icons-material";
import { Contract, utils } from "ethers";
import { useWeb3React } from "@web3-react/core";

import { useDeploy } from "@gemunion/react-hooks-eth";
import { useUser } from "@gemunion/provider-user";
import { ListAction, ListActionVariant } from "@framework/styled";
import type { IContract, IErc998ContractDeployDto, IUser } from "@framework/types";
import { Erc998ContractTemplates } from "@framework/types";

import ERC998FactoryFacetDeployERC998TokenABI from "@framework/abis/json/ERC998FactoryFacet/deployERC998Token.json";

import { Erc998ContractDeployDialog } from "./dialog";

export interface IErc998ContractDeployButtonProps {
  className?: string;
  disabled?: boolean;
  variant?: ListActionVariant;
}

export const Erc998ContractDeployButton: FC<IErc998ContractDeployButtonProps> = props => {
  const { className, disabled, variant = ListActionVariant.button } = props;

  const { profile } = useUser<IUser>();
  const { chainId } = useWeb3React();
  // TOKEN URI WITH CHAIN_ID
  const tokenURI = `${process.env.JSON_URL}/metadata/${chainId ? chainId.toString() : "0"}`;

  const { isDeployDialogOpen, handleDeployCancel, handleDeployConfirm, handleDeploy } = useDeploy(
    (values: IErc998ContractDeployDto, web3Context, sign, systemContract: IContract) => {
      const nonce = utils.arrayify(sign.nonce);
      const contract = new Contract(
        systemContract.address,
        ERC998FactoryFacetDeployERC998TokenABI,
        web3Context.provider?.getSigner(),
      );

      return contract.deployERC998Token(
        {
          nonce,
          bytecode: sign.bytecode,
          externalId: profile.id,
        },
        // values,
        {
          contractTemplate: Object.values(Erc998ContractTemplates).indexOf(values.contractTemplate).toString(),
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
        url: "/contract-manager/erc998",
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
        dataTestId="Erc998ContractDeployButton"
        disabled={disabled}
        variant={variant}
      />
      <Erc998ContractDeployDialog
        onConfirm={onDeployConfirm}
        onCancel={handleDeployCancel}
        open={isDeployDialogOpen}
        initialValues={{
          contractTemplate: Erc998ContractTemplates.SIMPLE,
          name: "",
          symbol: "",
          baseTokenURI: tokenURI,
          royalty: 0,
        }}
      />
    </Fragment>
  );
};
