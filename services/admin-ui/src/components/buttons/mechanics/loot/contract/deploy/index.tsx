import { FC, Fragment } from "react";
import { Add } from "@mui/icons-material";
import { Contract, utils } from "ethers";
import { useWeb3React } from "@web3-react/core";

import { useDeploy } from "@gemunion/react-hooks-eth";
import { useUser } from "@gemunion/provider-user";
import { ListAction, ListActionVariant } from "@framework/styled";
import type { ILootContractDeployDto, IUser, IContract } from "@framework/types";
import { LootContractTemplates } from "@framework/types";
import deployLootBoxLootBoxFactoryFacetABI from "@framework/abis/json/LootBoxFactoryFacet/deployLootBox.json";

import { LootContractDeployDialog } from "./dialog";

export interface ILootContractDeployButtonProps {
  className?: string;
  disabled?: boolean;
  variant?: ListActionVariant;
}

export const LootContractDeployButton: FC<ILootContractDeployButtonProps> = props => {
  const { className, disabled, variant = ListActionVariant.button } = props;

  const { profile } = useUser<IUser>();
  const { chainId } = useWeb3React();
  // TOKEN URI WITH CHAIN_ID
  const tokenURI = `${process.env.JSON_URL}/metadata/${chainId ? chainId.toString() : "0"}`;

  const { isDeployDialogOpen, handleDeployCancel, handleDeployConfirm, handleDeploy } = useDeploy(
    (values: ILootContractDeployDto, web3Context, sign, systemContract: IContract) => {
      const nonce = utils.arrayify(sign.nonce);
      const contract = new Contract(
        systemContract.address,
        deployLootBoxLootBoxFactoryFacetABI,
        web3Context.provider?.getSigner(),
      );

      return contract.deployLootBox(
        {
          nonce,
          bytecode: sign.bytecode,
          externalId: profile.id,
        },
        // values,
        {
          contractTemplate: Object.values(LootContractTemplates).indexOf(values.contractTemplate).toString(),
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
        url: "/contract-manager/lootbox",
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
        dataTestId="LootContractDeployButton"
        disabled={disabled}
        variant={variant}
      />
      <LootContractDeployDialog
        onConfirm={onDeployConfirm}
        onCancel={handleDeployCancel}
        open={isDeployDialogOpen}
        initialValues={{
          contractTemplate: LootContractTemplates.SIMPLE,
          name: "",
          symbol: "",
          baseTokenURI: tokenURI,
          royalty: 0,
        }}
      />
    </Fragment>
  );
};
