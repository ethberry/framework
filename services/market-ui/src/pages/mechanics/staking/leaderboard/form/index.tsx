import { FC } from "react";
import { Collapse, Grid } from "@mui/material";
import { useIntl } from "react-intl";

import { AutoSave, FormWrapper } from "@gemunion/mui-form";
import { SelectInput } from "@gemunion/mui-inputs-core";
import type { IStakingLeaderboardSearchDto } from "@framework/types";
import { TokenType } from "@framework/types";

import { SearchContractInput } from "../../../../../components/inputs/search-contract";

interface IStakingLeaderboardSearchFormProps {
  onSubmit: (values: IStakingLeaderboardSearchDto) => Promise<void>;
  initialValues: IStakingLeaderboardSearchDto;
  open: boolean;
}

export const StakingLeaderboardSearchForm: FC<IStakingLeaderboardSearchFormProps> = props => {
  const { onSubmit, initialValues, open } = props;

  const { formatMessage } = useIntl();

  const { deposit, reward } = initialValues;
  const fixedValues = { deposit, reward };

  return (
    <FormWrapper
      initialValues={fixedValues}
      onSubmit={onSubmit}
      showButtons={false}
      showPrompt={false}
      testId="StakingLeaderboardSearchForm"
    >
      <Collapse in={open}>
        <Grid container spacing={2} alignItems="flex-end">
          <Grid item xs={6}>
            <SelectInput
              name="deposit.tokenType"
              options={TokenType}
              label={formatMessage({ id: "form.labels.deposit" })}
            />
          </Grid>
          <Grid item xs={6}>
            <SelectInput
              name="reward.tokenType"
              options={TokenType}
              label={formatMessage({ id: "form.labels.reward" })}
            />
          </Grid>
          <Grid item xs={6}>
            <SearchContractInput prefix="deposit" />
          </Grid>
          <Grid item xs={6}>
            <SearchContractInput prefix="reward" />
          </Grid>
        </Grid>
      </Collapse>
      <AutoSave onSubmit={onSubmit} awaitingFieldsNames={["deposit.contractId", "reward.contractId"]} />
    </FormWrapper>
  );
};
