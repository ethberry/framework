import { FC, ReactElement } from "react";
import { useFormContext, useWatch } from "react-hook-form";
import { FormControl, FormHelperText, Grid, IconButton, InputLabel, Tooltip } from "@mui/material";
import { Delete } from "@mui/icons-material";
import { FormattedMessage, useIntl } from "react-intl";

import { S3FileInput, useDeleteUrl, Accept } from "@gemunion/mui-inputs-file-s3";

import { useStyles } from "./styles";

export interface IAvatarInputProps {
  name: string;
  label?: string | number | ReactElement;
  bucket?: string;
  accept?: Accept;
}

export const AvatarInput: FC<IAvatarInputProps> = props => {
  const { name, label, bucket, accept } = props;

  const form = useFormContext<any>();
  const error = form.formState.errors[name];
  const touched = Boolean(form.formState.touchedFields[name]);
  const value = useWatch({ name });

  const classes = useStyles();
  const { formatMessage } = useIntl();
  const deleteUrl = useDeleteUrl(bucket);
  const suffix = name.split(".").pop() as string;
  const localizedLabel = label === void 0 ? formatMessage({ id: `form.labels.${suffix}` }) : label;
  const localizedHelperText = error ? formatMessage({ id: error.message }, { label: localizedLabel }) : "";

  const onChange = (url: string) => {
    form.setValue(name, url, { shouldTouch: true });
  };

  const onDelete = async () => {
    await deleteUrl(value);
    form.setValue(name, "", { shouldTouch: false });
  };

  if (value) {
    return (
      <FormControl fullWidth className={classes.root}>
        <InputLabel id={`${name}-select-label`} shrink className={classes.label}>
          {localizedLabel}
        </InputLabel>
        <Tooltip title={formatMessage({ id: "form.tips.delete" })}>
          <IconButton aria-label="delete" onClick={onDelete} className={classes.button} size="medium">
            <Delete fontSize="inherit" />
          </IconButton>
        </Tooltip>
        <img src={value} className={classes.image} alt={formatMessage({ id: `form.labels.${name}` })} />
        {localizedHelperText && (
          <FormHelperText id={`${name}-helper-text`} error>
            {localizedHelperText}
          </FormHelperText>
        )}
      </FormControl>
    );
  }

  return (
    <FormControl fullWidth className={classes.root}>
      <InputLabel id={`${name}-select-label`} shrink>
        <FormattedMessage id={`form.labels.${name}`} />
      </InputLabel>
      <Grid container className={classes.container}>
        <Grid item>
          <S3FileInput onChange={onChange} bucket={bucket} accept={accept} maxFiles={1} />
          {touched && error && (
            <FormHelperText id={`${name}-helper-text`} error>
              {localizedHelperText}
            </FormHelperText>
          )}
        </Grid>
      </Grid>
    </FormControl>
  );
};
