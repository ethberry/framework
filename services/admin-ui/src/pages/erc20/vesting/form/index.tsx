import { FC } from "react";
import { Collapse, Grid } from "@mui/material";

import { FormWrapper } from "@gemunion/mui-form";
import { SearchInput, SelectInput } from "@gemunion/mui-inputs-core";
import { Erc20VestingTemplate, IErc20VestingSearchDto } from "@framework/types";

import { useStyles } from "./styles";

interface IVestingSearchFormProps {
  onSearch: (values: IErc20VestingSearchDto) => void;
  initialValues: IErc20VestingSearchDto;
  open: boolean;
}

export const Erc20VestingSearchForm: FC<IVestingSearchFormProps> = props => {
  const { onSearch, initialValues, open } = props;

  const classes = useStyles();

  const { query, contractTemplate } = initialValues;
  const fixedValues = { query, contractTemplate };

  return (
    <FormWrapper
      initialValues={fixedValues}
      onSubmit={onSearch}
      showButtons={false}
      showPrompt={false}
      className={classes.root}
      data-testid="Erc20VestingSearchForm"
    >
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <SearchInput name="query" onSearch={onSearch} />
        </Grid>
      </Grid>
      <Collapse in={open}>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <SelectInput name="contractTemplate" options={Erc20VestingTemplate} onSearch={onSearch} multiple />
          </Grid>
        </Grid>
      </Collapse>
    </FormWrapper>
  );
};
