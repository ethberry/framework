import { FC, Fragment } from "react";
import { Button } from "@mui/material";
import { Add } from "@mui/icons-material";
import { FormattedMessage } from "react-intl";
import { BigNumber, Contract, utils } from "ethers";

import { useDeploy } from "@gemunion/react-hooks-eth";
import { useUser } from "@gemunion/provider-user";
import type { IUser, IVestingContractDeployDto } from "@framework/types";

import DeployVestingABI from "../../../../../abis/mechanics/vesting/deploy/deployVesting.abi.json";

import { VestingDeployDialog } from "./dialog";

export interface IVestingDeployButtonProps {
  className?: string;
}

export const VestingDeployButton: FC<IVestingDeployButtonProps> = props => {
  const { className } = props;

  const { profile } = useUser<IUser>();
  // ethersV6 : concat([zeroPadValue(toBeHex(userEntity.id), 3), zeroPadValue(toBeHex(claimEntity.id), 4)]);
  const encodedExternalId = BigNumber.from(
    utils.hexlify(
      utils.concat([utils.zeroPad(utils.hexlify(profile.id), 3), utils.zeroPad(utils.hexlify(0 /* claim.id */), 4)]),
    ),
  );

  const { isDeployDialogOpen, handleDeployCancel, handleDeployConfirm, handleDeploy } = useDeploy(
    (values: IVestingContractDeployDto, web3Context, sign) => {
      const { beneficiary, startTimestamp, cliffInMonth, monthlyRelease } = values;

      const nonce = utils.arrayify(sign.nonce);

      const contract = new Contract(
        process.env.CONTRACT_MANAGER_ADDR,
        DeployVestingABI,
        web3Context.provider?.getSigner(),
      );

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
      <Button
        variant="outlined"
        startIcon={<Add />}
        onClick={handleDeploy}
        data-testid="VestingDeployButton"
        className={className}
      >
        <FormattedMessage id="form.buttons.deploy" />
      </Button>
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
