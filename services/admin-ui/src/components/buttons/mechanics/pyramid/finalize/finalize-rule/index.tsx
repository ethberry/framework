import { FC } from "react";
import { useIntl } from "react-intl";
import { IconButton, Tooltip } from "@mui/material";
import { ShoppingCartCheckout } from "@mui/icons-material";
import { Contract } from "ethers";
import { Web3ContextType } from "@web3-react/core";

import { useMetamask } from "@gemunion/react-hooks-eth";
import { IPyramidRule, PyramidRuleStatus } from "@framework/types";

import FinalizeByRuleIdABI from "./finalizeByRuleId.abi.json";
// import PyramidSol from "@framework/core-contracts/artifacts/contracts/Mechanics/Pyramid/Pyramid.sol/Pyramid.json";

export interface IPyramidFinalizeRuleButtonProps {
  rule: IPyramidRule;
}

export const PyramidFinalizeRuleButton: FC<IPyramidFinalizeRuleButtonProps> = props => {
  const { rule } = props;
  const { formatMessage } = useIntl();

  const metaFinalizeRule = useMetamask(async (rule: IPyramidRule, web3Context: Web3ContextType) => {
    if (rule.pyramidRuleStatus === PyramidRuleStatus.NEW) {
      return Promise.reject(new Error(""));
    }
    const contract = new Contract(rule.contract.address, FinalizeByRuleIdABI, web3Context.provider?.getSigner());
    // https://ethereum.stackexchange.com/questions/132850/incorrect-gaslimit-estimation-for-transaction
    const estGas = await contract.estimateGas.finalizeByRuleId(rule.externalId);
    return contract.finalizeByRuleId(rule.externalId, {
      gasLimit: estGas.add(estGas.div(100).mul(10)),
    }) as Promise<void>;
  });

  const handleFinalizeRule = (rule: IPyramidRule): (() => Promise<void>) => {
    return async (): Promise<void> => {
      return metaFinalizeRule(rule);
    };
  };

  if (rule.pyramidRuleStatus === PyramidRuleStatus.NEW) {
    return null;
  }

  return (
    <Tooltip
      title={formatMessage({
        id: "pages.pyramid.rules.finalizeByRule",
      })}
    >
      <IconButton onClick={handleFinalizeRule(rule)} data-testid="StakeRuleFinalizeByRuleButton">
        <ShoppingCartCheckout />
      </IconButton>
    </Tooltip>
  );
};
