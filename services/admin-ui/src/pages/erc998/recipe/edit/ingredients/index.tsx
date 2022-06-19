import { FC, Fragment } from "react";
import { Grid, IconButton, Tooltip, Typography } from "@mui/material";
import { Add, Delete } from "@mui/icons-material";
import { FormattedMessage, useIntl } from "react-intl";
import { get, useFormContext, useWatch } from "react-hook-form";

import { NumberInput } from "@gemunion/mui-inputs-core";
import { EntityInput } from "@gemunion/mui-inputs-entity";
import { IErc998Ingredient } from "@framework/types";

export interface IIngredientTokenDialogProps {
  name: string;
}

export const Ingredients: FC<IIngredientTokenDialogProps> = props => {
  const { name = "ingredients" } = props;

  const { formatMessage } = useIntl();
  const form = useFormContext<any>();
  const value = useWatch({ name });

  const handleOptionAdd = (): (() => void) => (): void => {
    const newValue = get(form.getValues(), name);
    newValue.push({
      erc1155TokenId: 1,
      amount: 1,
    });
    form.setValue(name, newValue);
  };

  const handleOptionDelete =
    (i: number): (() => void) =>
    (): void => {
      const newValue = get(form.getValues(), name);
      newValue.splice(i, 1);
      form.setValue(name, newValue);
    };

  return (
    <Fragment>
      <Typography>
        <FormattedMessage id="form.labels.ingredients" />
        <Tooltip title={formatMessage({ id: "form.tips.create" })}>
          <IconButton size="large" aria-label="add" onClick={handleOptionAdd()}>
            <Add fontSize="large" color="primary" />
          </IconButton>
        </Tooltip>
      </Typography>
      {value.map((_o: IErc998Ingredient, i: number) => (
        <Grid container key={i}>
          <Grid item xs={1}>
            <NumberInput name={`${name}[${i}].amount`} />
          </Grid>
          <Grid item xs={5}>
            <EntityInput name={`${name}[${i}].erc1155TokenId`} controller="erc1155-tokens" />
          </Grid>
          <Grid item>
            <IconButton aria-label="delete" onClick={handleOptionDelete(i)}>
              <Delete />
            </IconButton>
          </Grid>
        </Grid>
      ))}
    </Fragment>
  );
};
