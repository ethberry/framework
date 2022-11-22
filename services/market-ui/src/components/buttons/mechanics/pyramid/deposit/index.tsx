import { FC } from "react";
import { useIntl } from "react-intl";
import { IconButton, Tooltip } from "@mui/material";
import { Savings } from "@mui/icons-material";
import { Contract } from "ethers";
import { Web3ContextType } from "@web3-react/core";

import { useMetamask } from "@gemunion/react-hooks-eth";
import { useSettings } from "@gemunion/provider-settings";

import { IPyramidRule, PyramidRuleStatus } from "@framework/types";

import PyramidSol from "@framework/core-contracts/artifacts/contracts/Mechanics/Pyramid/Pyramid.sol/Pyramid.json";
import { getEthPrice } from "../../../../../utils/money";

export interface IPyramidDepositButtonProps {
  rule: IPyramidRule;
}

export const PyramidDepositButton: FC<IPyramidDepositButtonProps> = props => {
  const { rule } = props;
  const settings = useSettings();

  const { formatMessage } = useIntl();

  const metaDeposit = useMetamask((rule: IPyramidRule, web3Context: Web3ContextType) => {
    const contract = new Contract(rule.contract.address, PyramidSol.abi, web3Context.provider?.getSigner());
    // TODO pass real tokenId of selected ERC721 or ERC998
    // const tokenId = 0;
    const tokenId = rule.deposit!.components[0].templateId; // for 1155

    const referrer = settings.getReferrer();
    // TODO check pyramid contract referral feature?
    return contract.deposit(referrer, rule.externalId, tokenId, {
      value: getEthPrice(rule.deposit),
    }) as Promise<void>;
  });

  const handleDeposit = (rule: IPyramidRule): (() => Promise<void>) => {
    return (): Promise<void> => {
      return metaDeposit(rule).then(() => {
        // TODO reload page
      });
    };
  };

  if (rule.pyramidRuleStatus !== PyramidRuleStatus.ACTIVE) {
    return null;
  }

  return (
    <Tooltip title={formatMessage({ id: "form.tips.deposit" })}>
      <IconButton onClick={handleDeposit(rule)} data-testid="StakeDepositSimpleButton">
        <Savings />
      </IconButton>
    </Tooltip>
  );
};
