import { FC, Fragment } from "react";
import { Add } from "@mui/icons-material";
import { Contract, utils } from "ethers";

import { useDeploy } from "@ethberry/react-hooks-eth";
import { useUser } from "@ethberry/provider-user";
import { ListAction, ListActionVariant } from "@framework/styled";
import type { IContract, IUser, ILegacyVestingContractDeployDto } from "@framework/types";
import { LegacyVestingContractTemplates } from "@framework/types";
import VestingFactoryFacetDeployVestingABI from "@framework/abis/json/LegacyVestingFactoryFacet/deployVesting.json";

import { LegacyVestingDeployDialog } from "./dialog";

export interface ILegacyVestingDeployButtonProps {
  className?: string;
  disabled?: boolean;
  variant?: ListActionVariant;
}

export const LegacyVestingDeployButton: FC<ILegacyVestingDeployButtonProps> = props => {
  const { className, disabled, variant = ListActionVariant.button } = props;

  const { profile } = useUser<IUser>();

  const { isDeployDialogOpen, handleDeployCancel, handleDeployConfirm, handleDeploy } = useDeploy(
    (values: ILegacyVestingContractDeployDto, web3Context, sign, systemContract: IContract) => {
      const { owner, startTimestamp, cliffInMonth, monthlyRelease, contractTemplate } = values;

      const nonce = utils.arrayify(sign.nonce);

      const contract = new Contract(
        systemContract.address,
        VestingFactoryFacetDeployVestingABI,
        web3Context.provider?.getSigner(),
      );

      return contract.deployVesting(
        {
          nonce,
          bytecode: sign.bytecode,
          externalId: profile.id,
        },
        {
          owner,
          startTimestamp: Math.ceil(new Date(startTimestamp).getTime() / 1000), // in seconds,
          cliffInMonth,
          monthlyRelease,
          contractTemplate: Object.values(LegacyVestingContractTemplates).indexOf(contractTemplate).toString(),
        },
        sign.signature,
      ) as Promise<void>;
    },
  );

  const onDeployConfirm = (values: Record<string, any>, form: any) => {
    return handleDeployConfirm(
      {
        url: "/contract-manager/legacy-vesting",
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
        dataTestId="VestingDeployButton"
        disabled={disabled}
        variant={variant}
      />
      <LegacyVestingDeployDialog
        onConfirm={onDeployConfirm}
        onCancel={handleDeployCancel}
        open={isDeployDialogOpen}
        initialValues={{
          owner: "",
          startTimestamp: new Date().toISOString(),
          cliffInMonth: 12,
          monthlyRelease: 1000,
          contractTemplate: LegacyVestingContractTemplates.VESTING,
        }}
      />
    </Fragment>
  );
};
