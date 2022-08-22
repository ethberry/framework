import { FC } from "react";
import { Collapse, Grid } from "@mui/material";
import { useIntl } from "react-intl";

import { AutoSave, FormWrapper } from "@gemunion/mui-form";
import { SearchInput, SelectInput } from "@gemunion/mui-inputs-core";
import { IStakingStakesSearchDto, StakeStatus, TokenType } from "@framework/types";

import { useStyles } from "./styles";

interface IStakesSearchFormProps {
  onSubmit: (values: IStakingStakesSearchDto) => Promise<void>;
  initialValues: IStakingStakesSearchDto;
  open: boolean;
}

export const StakesSearchForm: FC<IStakesSearchFormProps> = props => {
  const { onSubmit, initialValues, open } = props;

  const classes = useStyles();
  const { formatMessage } = useIntl();

  const { query, stakeStatus, deposit, reward } = initialValues;
  const fixedValues = { query, stakeStatus, deposit, reward };

  return (
    <FormWrapper
      initialValues={fixedValues}
      onSubmit={onSubmit}
      showButtons={false}
      showPrompt={false}
      className={classes.root}
      testId="StakesSearchForm"
    >
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <SearchInput name="query" />
        </Grid>
      </Grid>
      <Collapse in={open}>
        <Grid container spacing={2} alignItems="flex-end">
          <Grid item xs={12}>
            <SelectInput name="stakeStatus" options={StakeStatus} multiple />
          </Grid>
          <Grid item xs={6}>
            <SelectInput
              multiple
              name="deposit.tokenType"
              options={TokenType}
              label={formatMessage({ id: "form.labels.deposit" })}
            />
          </Grid>
          <Grid item xs={6}>
            <SelectInput
              multiple
              name="reward.tokenType"
              options={TokenType}
              label={formatMessage({ id: "form.labels.reward" })}
            />
          </Grid>
        </Grid>
      </Collapse>
      <AutoSave onSubmit={onSubmit} />
    </FormWrapper>
  );
};
