import { FC, Fragment } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import { Grid, IconButton, List, Tooltip, Typography } from "@mui/material";
import { Add, Delete } from "@mui/icons-material";
import { useFormContext, useWatch } from "react-hook-form";

import { NumberInput } from "@ethberry/mui-inputs-core";
import { EntityInput } from "@ethberry/mui-inputs-entity";
import { StyledListItem } from "@framework/styled";
import type { IOrder, IOrderItem, IProductItem } from "@framework/types";

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

  const getTitle = (item: Partial<IProductItem>): string => {
    const { product, parameters } = item;

    const title = product?.title || "";

    if (parameters?.length) {
      return `${title} (${parameters.map(({ parameterValue }) => parameterValue).join(", ")})`;
    }

    return title;
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
              <Grid item sx={{ flexGrow: 1 }}>
                <EntityInput
                  name={`${name}[${i}].productItemId`}
                  controller="ecommerce/product-item"
                  getTitle={getTitle}
                />
              </Grid>
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
