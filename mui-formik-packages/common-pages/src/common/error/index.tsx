import { FC } from "react";
import { FormattedMessage } from "react-intl";
import { Alert } from "@mui/material";
import { useParams } from "react-router";

import { useStyles } from "./styles";

export const Error: FC = () => {
  const classes = useStyles();
  const { error } = useParams<{ error: string }>();
  return (
    <Alert className={classes.text} severity="error">
      <FormattedMessage id={`errors.${error as string}`} />
    </Alert>
  );
};
