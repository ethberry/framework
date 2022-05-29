import { FC } from "react";
import { useFormContext } from "react-hook-form";
import { Button } from "@mui/material";
import { FormattedMessage } from "react-intl";
import { Link as RouterLink } from "react-router-dom";

import { ButtonToolbar } from "@gemunion/mui-page-layout";

export const LoginButtons: FC = () => {
  const { formState: { isSubmitting } } = useFormContext();
  return (
    <ButtonToolbar>
      <Button variant="text" type="button" to="/forgot-password" component={RouterLink} data-testid="forgotEmailButton">
        <FormattedMessage id="form.buttons.forgot" />
      </Button>
      <Button
        variant="contained"
        type="button"
        to="/registration"
        component={RouterLink}
        data-testid="signupWithEmailButton"
      >
        <FormattedMessage id="form.buttons.signup" />
      </Button>
      <Button
        variant="contained"
        type="submit"
        color="primary"
        disabled={isSubmitting}
        data-testid="loginWithEmailButton"
      >
        <FormattedMessage id="form.buttons.login" />
      </Button>
    </ButtonToolbar>
  );
};
