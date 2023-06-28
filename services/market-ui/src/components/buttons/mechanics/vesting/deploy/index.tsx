import { FC } from "react";
import { IconButton, Tooltip } from "@mui/material";
import { Web3ContextType } from "@web3-react/core";
import { Inventory } from "@mui/icons-material";
import { Contract } from "ethers";
import { useIntl } from "react-intl";

import { useMetamask } from "@gemunion/react-hooks-eth";
import type { IClaim } from "@framework/types";
import { TokenType } from "@framework/types";

import VestingDeployABI from "../../../../../abis/mechanics/vesting/deploy/deployVesting.abi.json";
import VestingDeployBytecode from "../../../../../abis/mechanics/vesting/deploy/bytecode.json";
import { sorter } from "../../../../../utils/sorter";

export interface IVestingReleaseButtonProps {
  claim: IClaim;
  disabled?: boolean;
}

export const VestingDeployButton: FC<IVestingReleaseButtonProps> = props => {
  const { claim, disabled } = props;
  const { formatMessage } = useIntl();

  const metaRelease = useMetamask(async (claim: IClaim, web3Context: Web3ContextType) => {
    console.log("metaReleaseclaim", claim);
    const contract = new Contract(
      process.env.CONTRACT_MANAGER_ADDR,
      VestingDeployABI,
      web3Context.provider?.getSigner(),
    );
    console.log("params", {
      nonce: claim.nonce,
      bytecode: claim.parameters.bytecode,
      externalId: claim.id,
    });
    console.log("args", {
      beneficiary: claim.parameters.beneficiary,
      startTimestamp: Math.ceil(new Date(claim.parameters.startTimestamp).getTime() / 1000),
      cliffInMonth: claim.parameters.cliffInMonth,
      monthlyRelease: claim.parameters.monthlyRelease,
    });
    console.log(
      "items",
      claim.item?.components.sort(sorter("id")).map(component => ({
        tokenType: Object.values(TokenType).indexOf(component.tokenType),
        token: component.contract?.address,
        tokenId: (component.templateId || 0).toString(), // suppression types check with 0
        amount: component.amount,
      })),
    );
    return contract.deployVesting(
      {
        nonce: claim.nonce,
        bytecode: claim.parameters.bytecode,
        externalId: claim.id,
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
    <Tooltip title={formatMessage({ id: "form.tips.release" })}>
      <IconButton onClick={handleClick} disabled={disabled} data-testid="VestingReleaseButton">
        <Inventory />
      </IconButton>
    </Tooltip>
  );
};
