import { FC, Fragment } from "react";
import { Button } from "@mui/material";
import { Add } from "@mui/icons-material";
import { FormattedMessage } from "react-intl";
import { Contract, utils } from "ethers";

import { useDeploy } from "@gemunion/react-hooks-eth";
import { Erc721CollectionFeatures, IErc721CollectionDeployDto } from "@framework/types";

import ContractManagerSol from "@framework/core-contracts/artifacts/contracts/ContractManager/ContractManager.sol/ContractManager.json";

import { Erc721CollectionDeployDialog } from "./deploy-dialog";

export interface IErc721CollectionDeployButtonProps {
  className?: string;
}

export const Erc721CollectionDeployButton: FC<IErc721CollectionDeployButtonProps> = props => {
  const { className } = props;

  const { isDeployDialogOpen, handleDeployCancel, handleDeployConfirm, handleDeploy } = useDeploy(
    (values: IErc721CollectionDeployDto, web3Context, sign) => {
      const { contractFeatures, name, symbol, royalty, baseTokenURI, batchSize } = values;

      const nonce = utils.arrayify(sign.nonce);
      const contract = new Contract(
        process.env.CONTRACT_MANAGER_ADDR,
        ContractManagerSol.abi,
        web3Context.provider?.getSigner(),
      );

      // return contract.deployERC721Collection(
      //   {
      //     nonce,
      //     bytecode: sign.bytecode,
      //     name,
      //     symbol,
      //     royalty,
      //     baseTokenURI,
      //     // contractFeatures: contractFeatures.map(feature => Object.keys(Erc721CollectionFeatures).indexOf(feature)),
      //     contractFeatures: [],
      //     batchSize,
      //   },
      //   process.env.ACCOUNT,
      //   sign.signature,
      // ) as Promise<void>;

      return contract.deployERC721Collection(
        {
          signer: process.env.ACCOUNT,
          signature: sign.signature,
        },
        {
          bytecode: sign.bytecode,
          name,
          symbol,
          baseTokenURI,
          featureIds: contractFeatures.map(feature => Object.keys(Erc721CollectionFeatures).indexOf(feature)),
          royalty,
          batchSize,
          nonce,
        },
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
        data-testid="Erc721CollectionDeployButton"
        className={className}
      >
        <FormattedMessage id="form.buttons.deploy" />
      </Button>
      <Erc721CollectionDeployDialog
        onConfirm={onDeployConfirm}
        onCancel={handleDeployCancel}
        open={isDeployDialogOpen}
        initialValues={{
          contractFeatures: [],
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
