import { FC } from "react";
import { useIntl } from "react-intl";
import { IconButton, Tooltip } from "@mui/material";
import { ProductionQuantityLimits } from "@mui/icons-material";
import { Contract } from "ethers";
import { Web3ContextType } from "@web3-react/core";

import { IPyramidRule, PyramidRuleStatus } from "@framework/types";
import { useMetamask } from "@gemunion/react-hooks-eth";

import PyramidSol from "@framework/core-contracts/artifacts/contracts/Mechanics/Pyramid/Pyramid.sol/Pyramid.json";

export interface IPyramidFinalizeRuleButtonProps {
  rule: IPyramidRule;
}

export const PyramidFinalizeTokenButton: FC<IPyramidFinalizeRuleButtonProps> = props => {
  const { rule } = props;
  const { formatMessage } = useIntl();

  const metaFinalizeRuleByToken = useMetamask((rule: IPyramidRule, web3Context: Web3ContextType) => {
    if (rule.pyramidRuleStatus === PyramidRuleStatus.NEW) {
      // this should never happen
      return Promise.reject(new Error(":)"));
    }
    const contract = new Contract(rule.contract.address, PyramidSol.abi, web3Context.provider?.getSigner());
    return contract.finalizeByToken(rule.deposit!.components[0].contract!.address) as Promise<void>;
  });

  const handleFinalizeRuleByToken = (rule: IPyramidRule): (() => Promise<void>) => {
    return (): Promise<void> => {
      return metaFinalizeRuleByToken(rule);
    };
  };

  if (rule.pyramidRuleStatus === PyramidRuleStatus.NEW) {
    return null;
  }

  return (
    <Tooltip
      title={formatMessage({
        id: "pages.pyramid.rules.finalizeByToken",
      })}
    >
      <IconButton onClick={handleFinalizeRuleByToken(rule)} data-testid="StakeRuleFinalizeByTokenButton">
        <ProductionQuantityLimits />
      </IconButton>
    </Tooltip>
  );
};
