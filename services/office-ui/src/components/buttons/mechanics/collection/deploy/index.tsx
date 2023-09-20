import { FC, Fragment } from "react";
import { Add } from "@mui/icons-material";
import { Contract, utils } from "ethers";

import { useDeploy } from "@gemunion/react-hooks-eth";
import { useUser } from "@gemunion/provider-user";
import { ListAction, ListActionVariant } from "@framework/mui-lists";
import type { ICollectionContractDeployDto, IContract, IUser } from "@framework/types";
import { CollectionContractTemplates } from "@framework/types";

import DeployCollectionABI from "../../../../../abis/mechanics/collection/contract-deploy/deployCollection.abi.json";

import { CollectionContractDeployDialog } from "./dialog";

export interface ICollectionContractDeployButtonProps {
  className?: string;
  disabled?: boolean;
  variant?: ListActionVariant;
}

export const CollectionContractDeployButton: FC<ICollectionContractDeployButtonProps> = props => {
  const { className, disabled, variant = ListActionVariant.button } = props;

  const { profile } = useUser<IUser>();

  const { isDeployDialogOpen, handleDeployCancel, handleDeployConfirm, handleDeploy } = useDeploy(
    (values: ICollectionContractDeployDto, web3Context, sign, systemContract: IContract) => {
      const nonce = utils.arrayify(sign.nonce);
      const contract = new Contract(systemContract.address, DeployCollectionABI, web3Context.provider?.getSigner());

      return contract.deployCollection(
        {
          nonce,
          bytecode: sign.bytecode,
          externalId: profile.id,
        },
        // values,
        {
          contractTemplate: Object.values(CollectionContractTemplates).indexOf(values.contractTemplate).toString(),
          name: values.name,
          symbol: values.symbol,
          baseTokenURI: values.baseTokenURI,
          royalty: values.royalty,
          batchSize: values.batchSize,
        },
        sign.signature,
      ) as Promise<void>;
    },
  );

  const onDeployConfirm = (values: Record<string, any>, form: any) => {
    return handleDeployConfirm(
      {
        url: "/contract-manager/erc721collection",
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
        dataTestId="CollectionContractDeployButton"
        disabled={disabled}
        variant={variant}
      />
      <CollectionContractDeployDialog
        onConfirm={onDeployConfirm}
        onCancel={handleDeployCancel}
        open={isDeployDialogOpen}
        initialValues={{
          contractTemplate: CollectionContractTemplates.SIMPLE,
          name: "",
          symbol: "",
          baseTokenURI: `${process.env.JSON_URL}/metadata`,
          royalty: 0,
          batchSize: 1000,
        }}
      />
    </Fragment>
  );
};
