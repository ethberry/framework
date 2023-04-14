import { FC } from "react";
import { Collapse, Grid } from "@mui/material";

import { AutoSave, FormWrapper } from "@gemunion/mui-form";
import { SearchInput } from "@gemunion/mui-inputs-core";
import { EntityInput } from "@gemunion/mui-inputs-entity";
import type { IAchievementLevelSearchDto } from "@framework/types";

interface IAchievementLevelSearchProps {
  onSubmit: (values: IAchievementLevelSearchDto) => Promise<void>;
  initialValues: IAchievementLevelSearchDto;
  open: boolean;
}

export const AchievementLevelSearchForm: FC<IAchievementLevelSearchProps> = props => {
  const { onSubmit, initialValues, open } = props;

  const { query, achievementRuleIds } = initialValues;
  const fixedValues = { query, achievementRuleIds };

  return (
    <FormWrapper
      initialValues={fixedValues}
      onSubmit={onSubmit}
      showButtons={false}
      showPrompt={false}
      testId="AchievementLevelSearchForm"
    >
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <SearchInput name="query" />
        </Grid>
      </Grid>
      <Collapse in={open}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <EntityInput name="achievementRuleIds" controller="achievements/rules" multiple />
          </Grid>
        </Grid>
      </Collapse>
      <AutoSave onSubmit={onSubmit} />
    </FormWrapper>
  );
};
