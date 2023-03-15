import { FC, useContext } from "react";
import { Grid } from "@mui/material";

import { AutoSave, FormWrapper } from "@gemunion/mui-form";
import { SelectInput } from "@gemunion/mui-inputs-core";
import { DateRangeInput } from "@gemunion/mui-inputs-picker";
import { IUserContext, UserContext } from "@gemunion/provider-user";
import { EntityInput } from "@gemunion/mui-inputs-entity";
import { IUser, OrderStatus, UserRole } from "@framework/types";

import { IOrderSearchDto } from "../index";

interface IOrderSearchFormProps {
  onSubmit: (values: IOrderSearchDto) => Promise<void>;
  initialValues: IOrderSearchDto;
}

export const OrderSearchForm: FC<IOrderSearchFormProps> = props => {
  const { onSubmit, initialValues } = props;

  const user = useContext<IUserContext<IUser>>(UserContext);
  const isAdmin = user.profile.userRoles.includes(UserRole.ADMIN);

  const { orderStatus, merchantId, dateRange } = initialValues;
  const fixedValues = { orderStatus, merchantId, dateRange };

  return (
    <FormWrapper initialValues={fixedValues} onSubmit={onSubmit} showButtons={false} showPrompt={false}>
      <Grid container spacing={2}>
        <Grid item xs={isAdmin ? 6 : 12}>
          <SelectInput multiple options={OrderStatus} name="orderStatus" />
        </Grid>
        {isAdmin ? (
          <Grid item xs={6}>
            <EntityInput name="merchantId" controller="merchants" />
          </Grid>
        ) : null}
        <Grid item xs={12}>
          <DateRangeInput name="dateRange" />
        </Grid>
      </Grid>
      <AutoSave onSubmit={onSubmit} />
    </FormWrapper>
  );
};
