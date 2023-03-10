import { FC } from "react";
import { useIntl } from "react-intl";
import { IconButton, Tooltip } from "@mui/material";
import { ProductionQuantityLimits } from "@mui/icons-material";
import { Contract } from "ethers";
import { Web3ContextType } from "@web3-react/core";

import { useMetamask } from "@gemunion/react-hooks-eth";
import { IPyramidRule, PyramidRuleStatus } from "@framework/types";

import FinalizeByTokenABI from "./finalizeByToken.abi.json";
// import PyramidSol from "@framework/core-contracts/artifacts/contracts/Mechanics/Pyramid/Pyramid.sol/Pyramid.json";

export interface IPyramidFinalizeRuleButtonProps {
  rule: IPyramidRule;
}

export const PyramidFinalizeTokenButton: FC<IPyramidFinalizeRuleButtonProps> = props => {
  const { rule } = props;
  const { formatMessage } = useIntl();

  const metaFinalizeRuleByToken = useMetamask(async (rule: IPyramidRule, web3Context: Web3ContextType) => {
    if (rule.pyramidRuleStatus === PyramidRuleStatus.NEW) {
      // this should never happen
      return Promise.reject(new Error(":)"));
    }

    const contract = new Contract(rule.contract.address, FinalizeByTokenABI, web3Context.provider?.getSigner());
    // https://ethereum.stackexchange.com/questions/132850/incorrect-gaslimit-estimation-for-transaction
    const estGas = await contract.estimateGas.finalizeByToken(rule.deposit!.components[0].contract!.address);
    return contract.finalizeByToken(rule.deposit!.components[0].contract!.address, {
      gasLimit: estGas.add(estGas.div(100).mul(10)),
    }) as Promise<void>;
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
