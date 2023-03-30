import { FC } from "react";
import { useIntl } from "react-intl";
import { IconButton, Tooltip } from "@mui/material";
import { Check, Close } from "@mui/icons-material";
import { Contract } from "ethers";
import { Web3ContextType } from "@web3-react/core";
import { useMetamask } from "@gemunion/react-hooks-eth";
import { IStakingRule, StakingRuleStatus } from "@framework/types";
import UpdateRuleABI from "./updateRule.abi.json";

export interface IStakingUploadButtonProps {
  rule: IStakingRule;
}

export const StakingUploadButton: FC<IStakingUploadButtonProps> = props => {
  const { rule } = props;
  const { formatMessage } = useIntl();

  // const metaLoadRule = useMetamask((rule: IStakingRule, mysteryBox: IMysterybox, web3Context: Web3ContextType) => {
  //   if (rule.stakingRuleStatus !== StakingRuleStatus.NEW) {
  //     return Promise.reject(new Error(""));
  //   }
  //
  //   let content = [] as Array<any>;
  //
  //   // MODULE:MYSTERYBOX
  //   if (mysteryBox) {
  //     content = mysteryBox.item!.components.map(component => ({
  //       tokenType: Object.keys(TokenType).indexOf(component.tokenType),
  //       token: component.contract!.address,
  //       tokenId: component.templateId || 0,
  //       amount: component.amount,
  //     }));
  //   }
  //
  //   const stakingRule = {
  //     externalId: rule.id,
  //     deposit: rule.deposit?.components.map(component => ({
  //       tokenType: Object.keys(TokenType).indexOf(component.tokenType),
  //       token: component.contract!.address,
  //       tokenId: component.templateId || 0,
  //       amount: component.amount,
  //     })),
  //     reward: rule.reward
  //       ? rule.reward.components.map(component => ({
  //           tokenType: Object.keys(TokenType).indexOf(component.tokenType),
  //           token: component.contract!.address,
  //           tokenId: component.templateId,
  //           amount: component.amount,
  //         }))
  //       : [],
  //     content,
  //     period: rule.durationAmount, // todo fix same name // seconds in days
  //     penalty: rule.penalty || 0,
  //     recurrent: rule.recurrent,
  //     active: true, // todo add var in interface
  //   };
  //
  //   const contract = new Contract(process.env.STAKING_ADDR, SetRulesABI, web3Context.provider?.getSigner());
  //   return contract.setRules([stakingRule]) as Promise<void>;
  // });

  // MODULE:MYSTERYBOX
  // const { fn } = useApiCall((api, data: { templateIds: Array<number> }) => {
  //   return api.fetchJson({
  //     url: "/mystery-boxes",
  //     data,
  //   });
  // });
  // const handleLoadRule = (rule: IStakingRule): (() => Promise<void>) => {
  //   return async (): Promise<void> => {
  //     // MODULE:MYSTERYBOX
  //     const {
  //       rows: [mysteryBox],
  //     } = await fn(void 0, { templateIds: [rule.reward!.components[0].templateId] });
  //     return metaLoadRule(rule, mysteryBox);
  //   };
  // };

  const metaToggleRule = useMetamask((rule: IStakingRule, web3Context: Web3ContextType) => {
    const ruleStatus: boolean = rule.stakingRuleStatus !== StakingRuleStatus.ACTIVE;
    const contract = new Contract(process.env.STAKING_ADDR, UpdateRuleABI, web3Context.provider?.getSigner());
    return contract.updateRule(rule.externalId || 0, ruleStatus) as Promise<void>;
  });

  const handleToggleRule = (rule: IStakingRule): (() => Promise<void>) => {
    return (): Promise<void> => {
      return metaToggleRule(rule);
    };
  };

  // if (!rule.externalId) {
  //   return (
  //     <Tooltip title={formatMessage({ id: "pages.staking.rules.upload" })}>
  //       <IconButton onClick={handleLoadRule(rule)} data-testid="StakeRuleUploadButton">
  //         <CloudUpload />
  //       </IconButton>
  //     </Tooltip>
  //   );
  // }

  return (
    <Tooltip
      title={formatMessage({
        id:
          rule.stakingRuleStatus === StakingRuleStatus.ACTIVE || rule.externalId
            ? "pages.staking.rules.deactivate"
            : "pages.staking.rules.activate",
      })}
    >
      <IconButton onClick={handleToggleRule(rule)} data-testid="StakeRuleToggleButton">
        {!rule.externalId ? <Check /> : <Close />}
      </IconButton>
    </Tooltip>
  );
};
