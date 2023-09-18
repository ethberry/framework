import { FC } from "react";
import { Savings } from "@mui/icons-material";
import { Web3ContextType } from "@web3-react/core";
import { Contract } from "ethers";

import { useMetamask } from "@gemunion/react-hooks-eth";
import { useSettings } from "@gemunion/provider-settings";

import { ListAction, ListActionVariant } from "@framework/mui-lists";
import { IPonziRule, PonziRuleStatus } from "@framework/types";

import PonziDepositABI from "../../../../../abis/mechanics/ponzi/deposit/deposit.abi.json";

import { getEthPrice } from "../../../../../utils/money";

export interface IPonziDepositButtonProps {
  className?: string;
  disabled?: boolean;
  rule: IPonziRule;
  variant?: ListActionVariant;
}

export const PonziDepositButton: FC<IPonziDepositButtonProps> = props => {
  const { className, disabled, rule, variant } = props;
  const settings = useSettings();

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
    <ListAction
      onClick={handleDeposit(rule)}
      icon={Savings}
      message="form.tips.deposit"
      className={className}
      dataTestId="StakeDepositSimpleButton"
      disabled={disabled}
      variant={variant}
    />
  );
};
