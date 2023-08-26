import { FC } from "react";
import { useIntl } from "react-intl";
import { IconButton, Tooltip } from "@mui/material";
import { Savings } from "@mui/icons-material";
import { Contract } from "ethers";
import { Web3ContextType } from "@web3-react/core";

import { useMetamask } from "@gemunion/react-hooks-eth";
import { useSettings } from "@gemunion/provider-settings";

import { IPonziRule, PonziRuleStatus } from "@framework/types";

import PonziDepositABI from "../../../../../abis/mechanics/ponzi/deposit/deposit.abi.json";

import { getEthPrice } from "../../../../../utils/money";

export interface IPonziDepositButtonProps {
  rule: IPonziRule;
}

export const PonziDepositButton: FC<IPonziDepositButtonProps> = props => {
  const { rule } = props;
  const settings = useSettings();

  const { formatMessage } = useIntl();

  const metaDeposit = useMetamask((rule: IPonziRule, web3Context: Web3ContextType) => {
    const contract = new Contract(rule.contract.address, PonziDepositABI, web3Context.provider?.getSigner());
    // TODO pass real tokenId of selected ERC721 or ERC998
    // const tokenId = 0;
    // const tokenId = rule.deposit!.components[0].templateId; // for 1155

    const referrer = settings.getReferrer();
    // TODO check ponzi contract referral feature?
    return contract.deposit(referrer, rule.externalId, {
      value: getEthPrice(rule.deposit),
    }) as Promise<void>;
  });

  const handleDeposit = (rule: IPonziRule): (() => Promise<void>) => {
    return (): Promise<void> => {
      return metaDeposit(rule).then(() => {
        // TODO reload page
      });
    };
  };

  if (rule.ponziRuleStatus !== PonziRuleStatus.ACTIVE) {
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
