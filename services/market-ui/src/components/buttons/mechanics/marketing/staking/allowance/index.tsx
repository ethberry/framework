import { FC } from "react";
import { ListActionVariant } from "@framework/styled";
import type { IStakingRule } from "@framework/types";
import { TokenType } from "@framework/types";

import { AllowanceButton } from "../../../../../../pages/exchange/wallet/allowance";

export interface IStakingAllowanceButtonProps {
  className?: string;
  disabled?: boolean;
  rule: IStakingRule;
  variant?: ListActionVariant;
}
// TODO allowance for deposit array
export const StakingAllowanceButton: FC<IStakingAllowanceButtonProps> = props => {
  const { disabled, rule } = props;
  const isDisabled = rule.deposit?.components.every(component => component.contract!.contractType === TokenType.NATIVE);

  const tokenTo = {
    components: [
      {
        amount: rule.deposit!.components[0].amount,
        contractId: rule.deposit!.components[0].contractId,
        templateId: rule.deposit!.components[0].templateId,
        tokenType: rule.deposit!.components[0].tokenType,
        contract: {
          address: rule.deposit!.components[0].contract!.address,
          decimals: rule.deposit!.components[0].contract!.decimals,
        },
      },
    ],
  };

  return (
    <AllowanceButton isSmall={true} token={tokenTo} contract={rule.contract} isDisabled={isDisabled || disabled} />
  );
};
