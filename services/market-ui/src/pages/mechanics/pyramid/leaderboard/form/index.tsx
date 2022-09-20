import { FC } from "react";
import { Collapse, Grid } from "@mui/material";
import { useIntl } from "react-intl";

import { AutoSave, FormWrapper } from "@gemunion/mui-form";
import { SelectInput } from "@gemunion/mui-inputs-core";
import { EntityInput } from "@gemunion/mui-inputs-entity";
import type { IPyramidLeaderboardSearchDto } from "@framework/types";
import { ModuleType, TokenType } from "@framework/types";

interface IPyramidLeaderboardSearchFormProps {
  onSubmit: (values: IPyramidLeaderboardSearchDto) => Promise<void>;
  initialValues: IPyramidLeaderboardSearchDto;
  open: boolean;
}

export const PyramidLeaderboardSearchForm: FC<IPyramidLeaderboardSearchFormProps> = props => {
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
      testId="PyramidLeaderboardSearchForm"
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
            <EntityInput
              name="deposit.contractId"
              controller="contracts"
              data={{
                contractType: [deposit.tokenType],
                contractModule: [ModuleType.HIERARCHY],
              }}
            />
          </Grid>
          <Grid item xs={6}>
            <EntityInput
              name="reward.contractId"
              controller="contracts"
              data={{
                contractType: [reward.tokenType],
                contractModule: [ModuleType.HIERARCHY],
              }}
            />
          </Grid>
        </Grid>
      </Collapse>
      <AutoSave onSubmit={onSubmit} />
    </FormWrapper>
  );
};
