import React, { FC } from "react";
import { Grid } from "@mui/material";

import { AutoSave, FormikForm } from "@gemunion/mui-form";
import { SelectInput } from "@gemunion/mui-inputs-core";
import { DateRangeInput } from "@gemunion/mui-inputs-picker";
import { OrderStatus } from "@gemunion/framework-types";

import { IOrderSearchDto } from "../index";

interface IOrderSearchFormProps {
  onSubmit: (values: IOrderSearchDto) => void;
  initialValues: IOrderSearchDto;
}

export const OrderSearchForm: FC<IOrderSearchFormProps> = props => {
  const { onSubmit, initialValues } = props;

  const { dateRange, orderStatus } = initialValues;
  const fixedValues = { dateRange, orderStatus };

  return (
    <FormikForm initialValues={fixedValues} onSubmit={onSubmit} showButtons={false} showPrompt={false}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <DateRangeInput name="dateRange" />
        </Grid>
        <Grid item xs={12}>
          <SelectInput multiple options={OrderStatus} name="orderStatus" />
        </Grid>
      </Grid>
      <AutoSave />
    </FormikForm>
  );
};
