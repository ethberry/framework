import { FC, Fragment } from "react";
import { Add } from "@mui/icons-material";
import { Contract, utils } from "ethers";
import { useWeb3React } from "@web3-react/core";

import { useDeploy } from "@ethberry/react-hooks-eth";
import { useUser } from "@ethberry/provider-user";
import { ListAction, ListActionVariant } from "@framework/styled";
import type { IVestingContractDeployDto, IUser, IContract } from "@framework/types";
import { VestingContractTemplates } from "@framework/types";
import VestingFactoryFacetDeployVestingBoxABI from "@framework/abis/json/VestingFactoryFacet/deployVestingBox.json";

import { VestingContractDeployDialog } from "./dialog";

export interface IVestingContractDeployButtonProps {
  className?: string;
  disabled?: boolean;
  variant?: ListActionVariant;
}

export const VestingContractDeployButton: FC<IVestingContractDeployButtonProps> = props => {
  const { className, disabled, variant = ListActionVariant.button } = props;

  const { profile } = useUser<IUser>();
  const { chainId } = useWeb3React();
  // TOKEN URI WITH CHAIN_ID
  const tokenURI = `${process.env.JSON_URL}/metadata/${chainId ? chainId.toString() : "0"}`;

  const { isDeployDialogOpen, handleDeployCancel, handleDeployConfirm, handleDeploy } = useDeploy(
    (values: IVestingContractDeployDto, web3Context, sign, systemContract: IContract) => {
      const nonce = utils.arrayify(sign.nonce);
      const contract = new Contract(
        systemContract.address,
        VestingFactoryFacetDeployVestingBoxABI,
        web3Context.provider?.getSigner(),
      );

      return contract.deployVestingBox(
        {
          nonce,
          bytecode: sign.bytecode,
          externalId: profile.id,
        },
        // values,
        {
          contractTemplate: Object.values(VestingContractTemplates).indexOf(values.contractTemplate).toString(),
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
        url: "/contract-manager/vesting",
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
        dataTestId="VestingContractDeployButton"
        disabled={disabled}
        variant={variant}
      />
      <VestingContractDeployDialog
        onConfirm={onDeployConfirm}
        onCancel={handleDeployCancel}
        open={isDeployDialogOpen}
        initialValues={{
          contractTemplate: VestingContractTemplates.SIMPLE,
          name: "",
          symbol: "",
          baseTokenURI: tokenURI,
          royalty: 0,
        }}
      />
    </Fragment>
  );
};
