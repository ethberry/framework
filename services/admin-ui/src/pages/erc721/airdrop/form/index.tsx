import { FC } from "react";
import { Collapse, Grid } from "@mui/material";

import { FormWrapper } from "@gemunion/mui-form";
import { Erc721AirdropStatus, IErc721AirdropSearchDto } from "@framework/types";
import { SearchInput, SelectInput } from "@gemunion/mui-inputs-core";

import { useStyles } from "./styles";

interface IErc721AirdropSearchFormProps {
  onSearch: (values: IErc721AirdropSearchDto) => void;
  initialValues: IErc721AirdropSearchDto;
  open: boolean;
}

export const Erc721AirdropSearchForm: FC<IErc721AirdropSearchFormProps> = props => {
  const { onSearch, initialValues, open } = props;

  const classes = useStyles();

  const { airdropStatus, query } = initialValues;
  const fixedValues = { airdropStatus, query };

  return (
    <FormWrapper
      initialValues={fixedValues}
      onSubmit={onSearch}
      showButtons={false}
      showPrompt={false}
      className={classes.root}
      data-testid="Erc721AirdropSearchForm"
    >
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <SearchInput name="query" onSearch={onSearch} />
        </Grid>
      </Grid>
      <Collapse in={open}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <SelectInput multiple name="airdropStatus" options={Erc721AirdropStatus} onSearch={onSearch} />
          </Grid>
        </Grid>
      </Collapse>
    </FormWrapper>
  );
};
