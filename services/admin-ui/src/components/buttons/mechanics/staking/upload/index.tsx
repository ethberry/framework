import { FC, Fragment, useState } from "react";
import { FormattedMessage } from "react-intl";

import { Button } from "@mui/material";
import { Add } from "@mui/icons-material";

import { Contract } from "ethers";
import { Web3ContextType } from "@web3-react/core";

import { useApiCall } from "@gemunion/react-hooks";
import { useMetamask } from "@gemunion/react-hooks-eth";
import { emptyStateString } from "@gemunion/draft-js-utils";
import { emptyPrice } from "@gemunion/mui-inputs-asset";
import { DurationUnit, IMysterybox, IStakingRule, TokenType } from "@framework/types";

import SetRulesABI from "./setRules.abi.json";
import { StakingRuleUploadDialog } from "./upload-dialog";

export interface IStakingRuleUploadCreateButtonProps {
  className?: string;
}

export const StakingRuleUploadCreateButton: FC<IStakingRuleUploadCreateButtonProps> = props => {
  const { className } = props;

  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);

  const handleUpload = () => {
    setIsUploadDialogOpen(true);
  };

  const handleUploadCancel = () => {
    setIsUploadDialogOpen(false);
  };

  // MODULE:MYSTERYBOX
  const { fn } = useApiCall((api, data: { templateIds: Array<number> }) => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return api.fetchJson({
      url: "/mystery-boxes",
      data,
    });
  });

  const metaLoadRule = useMetamask((rule: IStakingRule, content: Array<any>, web3Context: Web3ContextType) => {
    // const content = [] as Array<any>;
    // if (rule.reward) {
    //   for (const rew of rule.reward.components) {
    //     const {
    //       rows: [mysteryBox],
    //     } = fn(void 0, { templateIds: [rew.templateId] });
    //     // MODULE:MYSTERYBOX
    //     if (mysteryBox) {
    //       content.push(
    //         (mysteryBox as IMysterybox).item!.components.map(component => ({
    //           tokenType: Object.keys(TokenType).indexOf(component.tokenType),
    //           token: component.contract!.address,
    //           tokenId: component.templateId || 0,
    //           amount: component.amount,
    //         })),
    //       );
    //     } else {
    //       content.push([]);
    //     }
    //   }
    // }

    const stakingRule = {
      externalId: rule.id || 0,
      deposit: rule.deposit?.components.map(component => ({
        tokenType: Object.keys(TokenType).indexOf(component.tokenType),
        token: component.contract!.address,
        tokenId: component.templateId || 0,
        amount: component.amount,
      })),
      reward: rule.reward
        ? rule.reward.components.map(component => ({
            tokenType: Object.keys(TokenType).indexOf(component.tokenType),
            token: component.contract!.address,
            tokenId: component.templateId,
            amount: component.amount,
          }))
        : [],
      content,
      period: rule.durationAmount, // todo fix same name // seconds in days
      penalty: rule.penalty || 0,
      recurrent: rule.recurrent,
      active: true, // todo add var in interface
    };
    console.log("stakingRule", stakingRule);
    console.log("stakingRulecontent", content);
    const contract = new Contract(process.env.STAKING_ADDR, SetRulesABI, web3Context.provider?.getSigner());
    return contract.setRules([stakingRule]) as Promise<void>;
  });

  const handleLoadRule = async (rule: Partial<IStakingRule>): Promise<void> => {
    // MODULE:MYSTERYBOX
    const content = [] as Array<any>;
    if (rule.reward) {
      for (const rew of rule.reward.components) {
        const {
          rows: [mysteryBox],
        } = await fn(void 0, { templateIds: [rew.templateId] });
        // MODULE:MYSTERYBOX
        if (mysteryBox) {
          content.push(
            (mysteryBox as IMysterybox).item!.components.map(component => ({
              tokenType: Object.keys(TokenType).indexOf(component.tokenType),
              token: component.contract!.address,
              tokenId: component.templateId || 0,
              amount: component.amount,
            })),
          );
        } else {
          content.push([]);
        }
      }
    }
    return metaLoadRule(rule, content).finally(() => {
      setIsUploadDialogOpen(false);
    });
  };

  // const handleLoadRule1 = (rule: Partial<IStakingRule>): (() => Promise<void>) => {
  //   return async (): Promise<void> => {
  //     // MODULE:MYSTERYBOX
  //     const content = [] as Array<any>;
  //     if (rule.reward) {
  //       for (const rew of rule.reward.components) {
  //         const {
  //           rows: [mysteryBox],
  //         } = await fn(void 0, { templateIds: [rew.templateId] });
  //         // MODULE:MYSTERYBOX
  //         if (mysteryBox) {
  //           content.push(
  //             (mysteryBox as IMysterybox).item!.components.map(component => ({
  //               tokenType: Object.keys(TokenType).indexOf(component.tokenType),
  //               token: component.contract!.address,
  //               tokenId: component.templateId || 0,
  //               amount: component.amount,
  //             })),
  //           );
  //         } else {
  //           content.push([]);
  //         }
  //       }
  //     }
  //     return metaLoadRule(rule, content);
  //   };
  // };

  return (
    <Fragment>
      <Button
        variant="outlined"
        startIcon={<Add />}
        onClick={handleUpload}
        data-testid="StakingRuleUploadButton"
        className={className}
      >
        <FormattedMessage id="form.buttons.upload" />
      </Button>
      <StakingRuleUploadDialog
        onConfirm={handleLoadRule}
        onCancel={handleUploadCancel}
        open={isUploadDialogOpen}
        initialValues={{
          title: "new STAKING rule",
          description: emptyStateString,
          deposit: emptyPrice,
          reward: emptyPrice,
          durationAmount: 2592000,
          durationUnit: DurationUnit.DAY,
          penalty: 100,
          recurrent: false,
        }}
      />
    </Fragment>
  );
};
