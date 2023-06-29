import { FC, Fragment, useState } from "react";
import { FormattedMessage } from "react-intl";

import { Button } from "@mui/material";
import { Add } from "@mui/icons-material";

import { Contract } from "ethers";
import { Web3ContextType } from "@web3-react/core";

import { useApiCall } from "@gemunion/react-hooks";
import { useMetamask } from "@gemunion/react-hooks-eth";
import { emptyPrice } from "@gemunion/mui-inputs-asset";
import { DurationUnit, IMysterybox, IPyramidRule, TokenType } from "@framework/types";

import PyramidSetRulesABI from "../../../../../abis/mechanics/pyramid/upload/setRules.abi.json";
import { PyramidRuleUploadDialog } from "./upload-dialog";

export interface IPyramidRuleCreateButtonProps {
  className?: string;
}

export const PyramidRuleCreateButton: FC<IPyramidRuleCreateButtonProps> = props => {
  const { className } = props;

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

  const metaLoadRule = useMetamask((rule: IPyramidRule, content: Array<any>, web3Context: Web3ContextType) => {
    const pyramidRule = {
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
    const contract = new Contract(rule.contract.address, PyramidSetRulesABI, web3Context.provider?.getSigner());
    return contract.setRules([pyramidRule]) as Promise<void>;
  });

  const handleLoadRule = async (rule: Partial<IPyramidRule>): Promise<void> => {
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
            (mysteryBox as IMysterybox).item!.components.map(component => ({
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
      <Button
        variant="outlined"
        startIcon={<Add />}
        onClick={handleUpload}
        data-testid="PyramidRuleUploadButton"
        className={className}
      >
        <FormattedMessage id="form.buttons.create" />
      </Button>
      <PyramidRuleUploadDialog
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
