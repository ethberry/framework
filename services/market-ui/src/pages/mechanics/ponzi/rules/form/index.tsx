import { FC } from "react";
import { Collapse, Grid } from "@mui/material";
import { useIntl } from "react-intl";

import { AutoSave, FormWrapper } from "@gemunion/mui-form";
import { SearchInput, SelectInput } from "@gemunion/mui-inputs-core";
import type { IPonziRuleSearchDto } from "@framework/types";
import { TokenType } from "@framework/types";

interface IPonziRuleSearchFormProps {
  onSubmit: (values: IPonziRuleSearchDto) => Promise<void>;
  initialValues: IPonziRuleSearchDto;
  open: boolean;
}

export const PonziRuleSearchForm: FC<IPonziRuleSearchFormProps> = props => {
  const { onSubmit, initialValues, open } = props;

  const { formatMessage } = useIntl();

  const { query, deposit, reward } = initialValues;
  const fixedValues = { query, deposit, reward };

  return (
    <FormWrapper
      initialValues={fixedValues}
      onSubmit={onSubmit}
      showButtons={false}
      showPrompt={false}
      testId="PonziRuleSearchForm"
    >
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <SearchInput name="query" />
        </Grid>
      </Grid>
      <Collapse in={open}>
        <Grid container columnSpacing={2} alignItems="flex-end">
          <Grid item xs={6}>
            <SelectInput
              multiple
              name="deposit.tokenType"
              options={TokenType}
              label={formatMessage({ id: "form.labels.deposit" })}
              disabledOptions={[TokenType.ERC721, TokenType.ERC998, TokenType.ERC1155]}
            />
          </Grid>
          <Grid item xs={6}>
            <SelectInput
              multiple
              name="reward.tokenType"
              options={TokenType}
              label={formatMessage({ id: "form.labels.reward" })}
              disabledOptions={[TokenType.ERC721, TokenType.ERC998, TokenType.ERC1155]}
            />
          </Grid>
        </Grid>
      </Collapse>
      <AutoSave onSubmit={onSubmit} />
    </FormWrapper>
  );
};
