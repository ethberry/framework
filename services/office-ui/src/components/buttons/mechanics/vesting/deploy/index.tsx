import { FC, Fragment } from "react";
import { Add } from "@mui/icons-material";
import { BigNumber, Contract, utils } from "ethers";

import { useDeploy } from "@gemunion/react-hooks-eth";
import { useUser } from "@gemunion/provider-user";
import { ListAction, ListActionVariant } from "@framework/mui-lists";
import type { IContract, IUser, IVestingContractDeployDto } from "@framework/types";

import DeployVestingABI from "../../../../../abis/mechanics/vesting/deploy/deployVesting.abi.json";

import { VestingDeployDialog } from "./dialog";

export interface IVestingDeployButtonProps {
  className?: string;
  disabled?: boolean;
  variant?: ListActionVariant;
}

export const VestingDeployButton: FC<IVestingDeployButtonProps> = props => {
  const { className, disabled, variant = ListActionVariant.button } = props;

  const { profile } = useUser<IUser>();
  // ethersV6 : concat([zeroPadValue(toBeHex(userEntity.id), 3), zeroPadValue(toBeHex(claimEntity.id), 4)]);
  const encodedExternalId = BigNumber.from(
    utils.hexlify(
      utils.concat([utils.zeroPad(utils.hexlify(profile.id), 3), utils.zeroPad(utils.hexlify(0 /* claim.id */), 4)]),
    ),
  );

  const { isDeployDialogOpen, handleDeployCancel, handleDeployConfirm, handleDeploy } = useDeploy(
    (values: IVestingContractDeployDto, web3Context, sign, systemContract: IContract) => {
      const { beneficiary, startTimestamp, cliffInMonth, monthlyRelease } = values;

      const nonce = utils.arrayify(sign.nonce);

      const contract = new Contract(systemContract.address, DeployVestingABI, web3Context.provider?.getSigner());

      return contract.deployVesting(
        {
          nonce,
          bytecode: sign.bytecode,
          externalId: encodedExternalId,
        },
        {
          beneficiary,
          startTimestamp: Math.ceil(new Date(startTimestamp).getTime() / 1000), // in seconds,
          cliffInMonth,
          monthlyRelease,
        },
        [],
        sign.signature,
      ) as Promise<void>;
    },
  );

  const onDeployConfirm = (values: Record<string, any>, form: any) => {
    return handleDeployConfirm(
      {
        url: "/contract-manager/vesting",
        method: "POST",
        data: Object.assign(values, { externalId: encodedExternalId.toString() }),
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
      <VestingDeployDialog
        onConfirm={onDeployConfirm}
        onCancel={handleDeployCancel}
        open={isDeployDialogOpen}
        initialValues={{
          beneficiary: "",
          startTimestamp: new Date().toISOString(),
          cliffInMonth: 12,
          monthlyRelease: 1000,
        }}
      />
    </Fragment>
  );
};
