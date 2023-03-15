import { FC, Fragment } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import { Grid, IconButton, List, ListItem, Tooltip, Typography } from "@mui/material";
import { Add, Delete } from "@mui/icons-material";
import { useFormContext, useWatch } from "react-hook-form";

import { NumberInput } from "@gemunion/mui-inputs-core";
import { EntityInput } from "@gemunion/mui-inputs-entity";
import { IOrder, IOrderItem } from "@framework/types";

import { useStyles } from "./styles";

export interface IUserInputProps {
  name: keyof IOrder;
}

export const ItemsInput: FC<IUserInputProps> = props => {
  const { name = "items" } = props;

  const classes = useStyles();

  const form = useFormContext();
  const value = useWatch({ name });

  const { formatMessage } = useIntl();

  const handleAddRow = (): void => {
    const newValue = value.concat({
      productId: null,
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
          <ListItem key={i}>
            <Grid container spacing={2}>
              <Grid item className={classes.root}>
                <EntityInput name={`${name}[${i}].productId`} controller="products" />
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
          </ListItem>
        ))}
      </List>
    </Fragment>
  );
};
