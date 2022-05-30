import { FC } from "react";
import { FormattedMessage } from "react-intl";
import { useParams } from "react-router";

import { Alert } from "@mui/material";

import { useStyles } from "./styles";

export const Message: FC = () => {
  const classes = useStyles();
  const { message } = useParams<{ message: string }>();
  return (
    <Alert className={classes.text} severity="warning">
      <FormattedMessage id={`messages.${message as string}`} />
    </Alert>
  );
};
