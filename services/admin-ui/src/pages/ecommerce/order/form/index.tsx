import { FC } from "react";
import { Grid } from "@mui/material";

import { AutoSave, FormWrapper } from "@gemunion/mui-form";
import { SelectInput } from "@gemunion/mui-inputs-core";
import { DateRangeInput } from "@gemunion/mui-inputs-picker";
import { OrderStatus } from "@framework/types";

import { IOrderSearchDto } from "../index";

interface IOrderSearchFormProps {
  onSubmit: (values: IOrderSearchDto) => Promise<void>;
  initialValues: IOrderSearchDto;
}

export const OrderSearchForm: FC<IOrderSearchFormProps> = props => {
  const { onSubmit, initialValues } = props;

  const { orderStatus, merchantId, dateRange } = initialValues;
  const fixedValues = { orderStatus, merchantId, dateRange };

  return (
    <FormWrapper initialValues={fixedValues} onSubmit={onSubmit} showButtons={false} showPrompt={false}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <SelectInput multiple options={OrderStatus} name="orderStatus" />
        </Grid>
        <Grid item xs={12}>
          <DateRangeInput name="dateRange" />
        </Grid>
      </Grid>
      <AutoSave onSubmit={onSubmit} />
    </FormWrapper>
  );
};
