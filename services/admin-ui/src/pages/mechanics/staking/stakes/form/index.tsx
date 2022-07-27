import { FC } from "react";
import { Collapse, Grid } from "@mui/material";

import { AutoSave, FormWrapper } from "@gemunion/mui-form";
import { SearchInput, SelectInput } from "@gemunion/mui-inputs-core";
import { IStakingStakesSearchDto, StakeStatus } from "@framework/types";

import { useStyles } from "./styles";

interface IStakesSearchFormProps {
  onSubmit: (values: IStakingStakesSearchDto) => Promise<void>;
  initialValues: IStakingStakesSearchDto;
  open: boolean;
}

export const StakesSearchForm: FC<IStakesSearchFormProps> = props => {
  const { onSubmit, initialValues, open } = props;

  const classes = useStyles();

  const { query, stakeStatus } = initialValues;
  const fixedValues = { query, stakeStatus };

  return (
    <FormWrapper
      initialValues={fixedValues}
      onSubmit={onSubmit}
      showButtons={false}
      showPrompt={false}
      className={classes.root}
      data-testid="StakesSearchForm"
    >
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <SearchInput name="query" />
        </Grid>
      </Grid>
      <Collapse in={open}>
        <Grid container spacing={2} alignItems="flex-end">
          <Grid item xs={6}>
            <SelectInput name="stakeStatus" options={StakeStatus} multiple />
          </Grid>
        </Grid>
      </Collapse>
      <AutoSave onSubmit={onSubmit} />
    </FormWrapper>
  );
};
