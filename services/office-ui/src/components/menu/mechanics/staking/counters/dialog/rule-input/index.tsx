import { ChangeEvent, FC } from "react";
import { useFormContext } from "react-hook-form";

import { EntityInput } from "@gemunion/mui-inputs-entity";
import { StakingRuleStatus } from "@framework/types";

export interface IStakingRuleInputProps {
  contractId?: number;
}

export const StakingRuleInput: FC<IStakingRuleInputProps> = props => {
  const { contractId } = props;
  const form = useFormContext<any>();

  const handleChange = (_event: ChangeEvent<unknown>, option: any | null): void => {
    form.setValue("stakingRule", option?.id ?? 0);
    form.setValue("stakingRule.externalId", option?.externalId ?? "0");
    form.setValue("stakingRule.title", option?.title ?? "0x");
  };

  return (
    <EntityInput
      name="stakingRule"
      controller="staking/rules"
      data={{
        stakingRuleStatus: [StakingRuleStatus.ACTIVE, StakingRuleStatus.INACTIVE, StakingRuleStatus.NEW],
        stakingId: contractId,
      }}
      onChange={handleChange}
      autoselect
    />
  );
};
