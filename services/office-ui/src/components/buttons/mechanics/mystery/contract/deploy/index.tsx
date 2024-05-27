import { FC, Fragment } from "react";
import { Add } from "@mui/icons-material";
import { Contract, utils } from "ethers";
import { useWeb3React } from "@web3-react/core";

import { useDeploy } from "@gemunion/react-hooks-eth";
import { useUser } from "@gemunion/provider-user";
import { ListAction, ListActionVariant } from "@framework/styled";
import type { IMysteryContractDeployDto, IUser, IContract } from "@framework/types";
import { MysteryContractTemplates } from "@framework/types";

import { MysteryContractDeployDialog } from "./dialog";
import deployMysteryboxMysteryBoxFactoryFacetABI from "@framework/abis/deployMysteryBox/MysteryBoxFactoryFacet.json";

export interface IMysteryContractDeployButtonProps {
  className?: string;
  disabled?: boolean;
  variant?: ListActionVariant;
}

export const MysteryContractDeployButton: FC<IMysteryContractDeployButtonProps> = props => {
  const { className, disabled, variant = ListActionVariant.button } = props;

  const { profile } = useUser<IUser>();
  const { chainId } = useWeb3React();
  // TOKEN URI WITH CHAIN_ID
  const tokenURI = `${process.env.JSON_URL}/metadata/${chainId ? chainId.toString() : "0"}`;

  const { isDeployDialogOpen, handleDeployCancel, handleDeployConfirm, handleDeploy } = useDeploy(
    (values: IMysteryContractDeployDto, web3Context, sign, systemContract: IContract) => {
      const nonce = utils.arrayify(sign.nonce);
      const contract = new Contract(
        systemContract.address,
        deployMysteryboxMysteryBoxFactoryFacetABI,
        web3Context.provider?.getSigner(),
      );

      return contract.deployMysterybox(
        {
          nonce,
          bytecode: sign.bytecode,
          externalId: profile.id,
        },
        // values,
        {
          contractTemplate: Object.values(MysteryContractTemplates).indexOf(values.contractTemplate).toString(),
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
        url: "/contract-manager/mysterybox",
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
        dataTestId="MysteryContractDeployButton"
        disabled={disabled}
        variant={variant}
      />
      <MysteryContractDeployDialog
        onConfirm={onDeployConfirm}
        onCancel={handleDeployCancel}
        open={isDeployDialogOpen}
        initialValues={{
          contractTemplate: MysteryContractTemplates.SIMPLE,
          name: "",
          symbol: "",
          baseTokenURI: tokenURI,
          royalty: 0,
        }}
      />
    </Fragment>
  );
};
