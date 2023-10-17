import { FC, Fragment, useState } from "react";
import { Add } from "@mui/icons-material";
import { Web3ContextType } from "@web3-react/core";
import { Contract } from "ethers";

import { useApiCall } from "@gemunion/react-hooks";
import { useMetamask } from "@gemunion/react-hooks-eth";
import { emptyPrice } from "@gemunion/mui-inputs-asset";
import { ListAction, ListActionVariant } from "@framework/mui-lists";
import { DurationUnit, IMysteryBox, IPonziRule, TokenType } from "@framework/types";

import PonziSetRulesABI from "../../../../../abis/mechanics/ponzi/upload/setRules.abi.json";
import { PonziRuleUploadDialog } from "./upload-dialog";

export interface IPonziRuleCreateButtonProps {
  className?: string;
  disabled?: boolean;
  variant?: ListActionVariant;
}

export const PonziRuleCreateButton: FC<IPonziRuleCreateButtonProps> = props => {
  const { className, disabled, variant } = props;

  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);

  const handleUpload = () => {
    setIsUploadDialogOpen(true);
  };

  const handleUploadCancel = () => {
    setIsUploadDialogOpen(false);
  };

  // MODULE:MYSTERYBOX
  const { fn } = useApiCall(
    (api, data: { templateIds: Array<number> }) => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return api.fetchJson({
        url: "/mystery/boxes",
        data,
      });
    },
    { success: false },
  );

  const metaLoadRule = useMetamask((rule: IPonziRule, content: Array<any>, web3Context: Web3ContextType) => {
    const ponziRule = {
      deposit: rule.deposit?.components.map(component => ({
        tokenType: Object.values(TokenType).indexOf(component.tokenType),
        token: component.contract!.address,
        tokenId: component.templateId || 0,
        amount: component.amount,
      })),
      reward: rule.reward
        ? rule.reward.components.map(component => ({
            tokenType: Object.values(TokenType).indexOf(component.tokenType),
            token: component.contract!.address,
            tokenId: component.templateId,
            amount: component.amount,
          }))
        : [],
      content,
      period: rule.durationAmount, // todo fix same name // seconds in days
      penalty: rule.penalty || 0,
      active: true, // todo add var in interface
    };
    const contract = new Contract(rule.contract.address, PonziSetRulesABI, web3Context.provider?.getSigner());
    return contract.setRules([ponziRule]) as Promise<void>;
  });

  const handleLoadRule = async (rule: Partial<IPonziRule>): Promise<void> => {
    // MODULE:MYSTERYBOX
    const content = [] as Array<any>;
    if (rule.reward) {
      for (const row of rule.reward.components) {
        const {
          rows: [mysteryBox],
        } = await fn(void 0, { templateIds: [row.templateId] });
        // MODULE:MYSTERYBOX
        if (mysteryBox) {
          content.push(
            (mysteryBox as IMysteryBox).item!.components.map(component => ({
              tokenType: Object.values(TokenType).indexOf(component.tokenType),
              token: component.contract!.address,
              tokenId: component.templateId || 0,
              amount: component.amount,
            })),
          );
        } else {
          content.push([]);
        }
      }
      if (!content.length) content.push([]);
    } else {
      content.push([]);
    }
    return metaLoadRule(rule, content).then(() => {
      setIsUploadDialogOpen(false);
    });
  };

  return (
    <Fragment>
      <ListAction
        onClick={handleUpload}
        icon={Add}
        message="form.buttons.create"
        className={className}
        dataTestId="PonziRuleUploadButton"
        disabled={disabled}
        variant={variant}
      />
      <PonziRuleUploadDialog
        onConfirm={handleLoadRule}
        onCancel={handleUploadCancel}
        open={isUploadDialogOpen}
        initialValues={{
          deposit: emptyPrice,
          reward: emptyPrice,
          durationAmount: 2592000,
          durationUnit: DurationUnit.DAY,
          penalty: 100,
        }}
      />
    </Fragment>
  );
};
