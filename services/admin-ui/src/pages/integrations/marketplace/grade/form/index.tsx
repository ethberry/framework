import { FC } from "react";
import { Collapse, Grid } from "@mui/material";

import { AutoSave, FormWrapper } from "@gemunion/mui-form";
import { EntityInput } from "@gemunion/mui-inputs-entity";
import { ContractFeatures, IMarketplaceSupplySearchDto, TokenType } from "@framework/types";

import { useStyles } from "./styles";
import { TemplateInput } from "./template-input";

interface IMarketplaceGradeSearchFormProps {
  onSubmit: (values: IMarketplaceSupplySearchDto) => Promise<any>;
  initialValues: IMarketplaceSupplySearchDto;
  open: boolean;
}

export const MarketplaceGradeSearchForm: FC<IMarketplaceGradeSearchFormProps> = props => {
  const { onSubmit, initialValues, open } = props;

  const classes = useStyles();

  const { contractIds, templateIds, attribute } = initialValues;
  const fixedValues = { contractIds, templateIds, attribute };

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
            <EntityInput
              name="contractIds"
              controller="contracts"
              multiple
              data={{
                contractType: [TokenType.ERC721, TokenType.ERC998],
                contractFeatures: [ContractFeatures.UPGRADEABLE],
              }}
            />
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
