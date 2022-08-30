import { FC } from "react";
import { Collapse, Grid } from "@mui/material";

import { AutoSave, FormWrapper } from "@gemunion/mui-form";
import { SelectInput } from "@gemunion/mui-inputs-core";
import type { IMarketplaceSupplySearchDto } from "@framework/types";
import { TokenStatus, TokenType } from "@framework/types";

import { useStyles } from "./styles";
import { TemplateInput } from "./template-input";
import { ContractInput } from "./contract-input";

interface IMarketplaceGradeSearchFormProps {
  onSubmit: (values: IMarketplaceSupplySearchDto) => Promise<any>;
  initialValues: IMarketplaceSupplySearchDto;
  open: boolean;
}

export const MarketplaceGradeSearchForm: FC<IMarketplaceGradeSearchFormProps> = props => {
  const { onSubmit, initialValues, open } = props;

  const classes = useStyles();

  const { tokenStatus, tokenType, contractIds, templateIds, attribute } = initialValues;
  const fixedValues = { tokenStatus, tokenType, contractIds, templateIds, attribute };

  return (
    <FormWrapper
      initialValues={fixedValues}
      onSubmit={onSubmit}
      showButtons={false}
      showPrompt={false}
      className={classes.root}
      testId="GradeSearchForm"
    >
      <Collapse in={open}>
        <Grid container spacing={2} alignItems="flex-end">
          <Grid item xs={6}>
            <SelectInput
              name="tokenType"
              options={TokenType}
              disabledOptions={[TokenType.NATIVE, TokenType.ERC20, TokenType.ERC1155]}
            />
          </Grid>
          <Grid item xs={6}>
            <SelectInput name="tokenStatus" options={TokenStatus} />
          </Grid>
          <Grid item xs={6}>
            <ContractInput />
          </Grid>
          <Grid item xs={6}>
            <TemplateInput />
          </Grid>
        </Grid>
      </Collapse>
      <AutoSave onSubmit={onSubmit} />
    </FormWrapper>
  );
};
