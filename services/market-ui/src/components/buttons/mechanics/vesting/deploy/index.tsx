import { FC } from "react";
import { Inventory } from "@mui/icons-material";
import { Web3ContextType } from "@web3-react/core";
import { BigNumber, Contract, utils } from "ethers";

import { useMetamask } from "@gemunion/react-hooks-eth";
import { useUser } from "@gemunion/provider-user";
import type { IClaim, IUser } from "@framework/types";
import { TokenType } from "@framework/types";

import VestingDeployABI from "../../../../../abis/mechanics/vesting/deploy/deployVesting.abi.json";

import { sorter } from "../../../../../utils/sorter";
import { ListAction, ListActionVariant } from "../../../../common/lists";

export interface IVestingReleaseButtonProps {
  claim: IClaim;
  disabled?: boolean;
  variant?: ListActionVariant;
}

export const VestingDeployButton: FC<IVestingReleaseButtonProps> = props => {
  const { claim, disabled, variant } = props;
  const { profile } = useUser<IUser>();

  // ethersV6 : concat([zeroPadValue(toBeHex(profile.id), 3), zeroPadValue(toBeHex(claim.id), 4)]);
  const encodedExternalId = BigNumber.from(
    utils.hexlify(
      utils.concat([utils.zeroPad(utils.hexlify(profile.id), 3), utils.zeroPad(utils.hexlify(claim.id), 4)]),
    ),
  );

  const metaRelease = useMetamask(async (claim: IClaim, web3Context: Web3ContextType) => {
    const contract = new Contract(
      process.env.CONTRACT_MANAGER_ADDR,
      VestingDeployABI,
      web3Context.provider?.getSigner(),
    );

    return contract.deployVesting(
      {
        nonce: utils.arrayify(claim.nonce),
        bytecode: claim.parameters.bytecode,
        externalId: encodedExternalId,
      },
      {
        beneficiary: claim.parameters.beneficiary,
        startTimestamp: Math.ceil(new Date(claim.parameters.startTimestamp).getTime() / 1000),
        cliffInMonth: claim.parameters.cliffInMonth,
        monthlyRelease: claim.parameters.monthlyRelease,
      },
      claim.item?.components.sort(sorter("id")).map(component => ({
        tokenType: Object.values(TokenType).indexOf(component.tokenType),
        token: component.contract?.address,
        tokenId: (component.templateId || 0).toString(), // suppression types check with 0
        amount: component.amount,
      })),
      claim.signature,
    ) as Promise<any>;
  });

  const handleClick = () => {
    return metaRelease(claim);
  };

  return (
    <ListAction
      onClick={handleClick}
      icon={Inventory}
      message="form.tips.deploy"
      disabled={disabled}
      dataTestId="VestingDeployButton"
      variant={variant}
    />
  );
};
