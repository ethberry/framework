import { FC } from "react";
import { Collapse, Grid } from "@mui/material";

import { OrderStatus } from "@framework/types";
import { AutoSave, FormWrapper } from "@gemunion/mui-form";
import { SelectInput } from "@gemunion/mui-inputs-core";
import { DateRangeInput } from "@gemunion/mui-inputs-picker";

import { TTransformedSearch } from "../index";

interface IOrderSearchFormProps {
  initialValues: TTransformedSearch;
  onSubmit: (values: TTransformedSearch) => Promise<void>;
  open: boolean;
}

export const OrderSearchForm: FC<IOrderSearchFormProps> = props => {
  const { initialValues, onSubmit, open } = props;

  const { dateRange, isArchived, merchantId, orderStatus } = initialValues;
  const fixedValues = { dateRange, isArchived, merchantId, orderStatus };

  return (
    <FormWrapper initialValues={fixedValues} onSubmit={onSubmit} showButtons={false} showPrompt={false}>
      <Collapse in={open}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <SelectInput multiple options={OrderStatus} name="orderStatus" />
          </Grid>
          <Grid item xs={12}>
            <DateRangeInput name="dateRange" />
          </Grid>
        </Grid>
      </Collapse>
      <AutoSave onSubmit={onSubmit} />
    </FormWrapper>
  );
};
