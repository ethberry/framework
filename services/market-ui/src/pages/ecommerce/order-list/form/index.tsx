import { FC } from "react";
import { Grid } from "@mui/material";

import { AutoSave, FormWrapper } from "@gemunion/mui-form";
import { SelectInput } from "@gemunion/mui-inputs-core";
import { DateRangeInput } from "@gemunion/mui-inputs-picker";
import { OrderStatus } from "@framework/types";

import { TTransformedSearch } from "../index";

interface IOrderSearchFormProps {
  onSubmit: (values: TTransformedSearch) => Promise<void>;
  initialValues: TTransformedSearch;
}

export const OrderSearchForm: FC<IOrderSearchFormProps> = props => {
  const { onSubmit, initialValues } = props;

  const { dateRange, orderStatus } = initialValues;
  const fixedValues = { dateRange, orderStatus };

  return (
    <FormWrapper initialValues={fixedValues} onSubmit={onSubmit} showButtons={false} showPrompt={false}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <DateRangeInput name="dateRange" />
        </Grid>
        <Grid item xs={12}>
          <SelectInput multiple options={OrderStatus} name="orderStatus" />
        </Grid>
      </Grid>
      <AutoSave onSubmit={onSubmit} />
    </FormWrapper>
  );
};
