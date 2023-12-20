import { FC, Fragment } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import { Grid, IconButton, List, Tooltip, Typography } from "@mui/material";
import { Add, Delete } from "@mui/icons-material";
import { useFormContext, useWatch } from "react-hook-form";

import { NumberInput } from "@gemunion/mui-inputs-core";
import { EntityInput } from "@gemunion/mui-inputs-entity";
import { StyledListItem } from "@framework/styled";
import type { IOrder, IOrderItem } from "@framework/types";

import { StyledGrid } from "./styled";

export interface IUserInputProps {
  name: keyof IOrder;
}

export const ItemsInput: FC<IUserInputProps> = props => {
  const { name = "orderItems" } = props;

  const form = useFormContext();
  const value = useWatch({ name });

  const { formatMessage } = useIntl();

  const handleAddRow = (): void => {
    const newValue = value.concat({
      productItemId: 0,
      amount: 1,
    });
    form.setValue(name, newValue, { shouldDirty: true });
  };

  const handleDeleteRow = (i: number): (() => void) => {
    return (): void => {
      const newValue = [...value];
      newValue.splice(i, 1);
      form.setValue(name, newValue, { shouldDirty: true });
    };
  };

  return (
    <Fragment>
      <Typography>
        <FormattedMessage id={`form.labels.${name}`} />
        <Tooltip title={formatMessage({ id: "form.tips.add" })}>
          <IconButton aria-label="add" onClick={handleAddRow}>
            <Add />
          </IconButton>
        </Tooltip>
      </Typography>

      <List>
        {value.map((row: IOrderItem, i: number) => (
          <StyledListItem key={row.id}>
            <Grid container spacing={2}>
              <StyledGrid item>
                <EntityInput name={`${name}[${i}].productItemId`} controller="product-items" />
              </StyledGrid>
              <Grid item>
                <NumberInput name={`${name}[${i}].amount`} InputProps={{ inputProps: { min: 1 } }} />
              </Grid>
              <Grid item>
                <Tooltip title={formatMessage({ id: "form.tips.delete" })}>
                  <IconButton aria-label="add" onClick={handleDeleteRow(i)}>
                    <Delete />
                  </IconButton>
                </Tooltip>
              </Grid>
            </Grid>
          </StyledListItem>
        ))}
      </List>
    </Fragment>
  );
};
