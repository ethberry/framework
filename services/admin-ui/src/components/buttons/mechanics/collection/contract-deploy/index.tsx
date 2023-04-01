import { FC, Fragment } from "react";
import { Button } from "@mui/material";
import { Add } from "@mui/icons-material";
import { FormattedMessage } from "react-intl";
import { Contract, utils } from "ethers";

import { useDeploy } from "@gemunion/react-hooks-eth";
import { Erc721CollectionTemplates, IErc721CollectionDeployDto } from "@framework/types";

import CollectionDeployCollectionABI from "../../../../../abis/components/buttons/mechanics/collection/contract-deploy/deployCollection.abi.json";

import { Erc721CollectionDeployDialog } from "./deploy-dialog";

export interface ICollectionContractDeployButtonProps {
  className?: string;
}

export const CollectionContractDeployButton: FC<ICollectionContractDeployButtonProps> = props => {
  const { className } = props;

  const { isDeployDialogOpen, handleDeployCancel, handleDeployConfirm, handleDeploy } = useDeploy(
    (values: IErc721CollectionDeployDto, web3Context, sign) => {
      const nonce = utils.arrayify(sign.nonce);
      const contract = new Contract(
        process.env.CONTRACT_MANAGER_ADDR,
        CollectionDeployCollectionABI,
        web3Context.provider?.getSigner(),
      );

      return contract.deployCollection(
        {
          nonce,
          bytecode: sign.bytecode,
        },
        // values,
        {
          contractTemplate: Object.values(Erc721CollectionTemplates).indexOf(values.contractTemplate).toString(),
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
      <Button
        variant="outlined"
        startIcon={<Add />}
        onClick={handleDeploy}
        data-testid="CollectionContractDeployButton"
        className={className}
      >
        <FormattedMessage id="form.buttons.deploy" />
      </Button>
      <Erc721CollectionDeployDialog
        onConfirm={onDeployConfirm}
        onCancel={handleDeployCancel}
        open={isDeployDialogOpen}
        initialValues={{
          contractTemplate: Erc721CollectionTemplates.SIMPLE,
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
