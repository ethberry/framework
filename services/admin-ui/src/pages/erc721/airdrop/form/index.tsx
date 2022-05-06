import { FC } from "react";
import { Collapse, Grid } from "@mui/material";

import { AutoSave, FormikForm } from "@gemunion/mui-form";
import { Erc721AirdropStatus, IErc721AirdropSearchDto } from "@framework/types";
import { SelectInput } from "@gemunion/mui-inputs-core";

import { useStyles } from "./styles";

interface IErc721AirdropSearchFormProps {
  onSubmit: (values: IErc721AirdropSearchDto) => void;
  initialValues: IErc721AirdropSearchDto;
  open: boolean;
}

export const Erc721AirdropSearchForm: FC<IErc721AirdropSearchFormProps> = props => {
  const { onSubmit, initialValues, open } = props;

  const classes = useStyles();

  const { airdropStatus } = initialValues;
  const fixedValues = { airdropStatus };

  return (
    <FormikForm
      initialValues={fixedValues}
      onSubmit={onSubmit}
      showButtons={false}
      showPrompt={false}
      className={classes.root}
      data-testid="Erc721AirdropSearchForm"
    >
      <Collapse in={open}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <SelectInput multiple name="airdropStatus" options={Erc721AirdropStatus} />
          </Grid>
        </Grid>
      </Collapse>
      <AutoSave />
    </FormikForm>
  );
};
