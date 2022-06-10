import { FC } from "react";
import { Collapse, Grid } from "@mui/material";

import { AutoSave, FormWrapper } from "@gemunion/mui-form";
import { Erc20TokenStatus, Erc20TokenTemplate, IErc20TokenSearchDto } from "@framework/types";
import { SearchInput, SelectInput } from "@gemunion/mui-inputs-core";

import { useStyles } from "./styles";

interface ITokenSearchFormProps {
  onSubmit: (values: IErc20TokenSearchDto) => Promise<void>;
  initialValues: IErc20TokenSearchDto;
  open: boolean;
}

export const Erc20TokenSearchForm: FC<ITokenSearchFormProps> = props => {
  const { onSubmit, initialValues, open } = props;

  const classes = useStyles();

  const { query, tokenStatus, contractTemplate } = initialValues;
  const fixedValues = { query, tokenStatus, contractTemplate };

  return (
    <FormWrapper
      initialValues={fixedValues}
      onSubmit={onSubmit}
      showButtons={false}
      showPrompt={false}
      className={classes.root}
      data-testid="Erc20TokenSearchForm"
    >
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <SearchInput name="query" />
        </Grid>
      </Grid>
      <Collapse in={open}>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <SelectInput name="tokenStatus" options={Erc20TokenStatus} multiple />
          </Grid>
          <Grid item xs={6}>
            <SelectInput name="contractTemplate" options={Erc20TokenTemplate} multiple />
          </Grid>
        </Grid>
      </Collapse>
      <AutoSave onSubmit={onSubmit} />
    </FormWrapper>
  );
};
