import { FC, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Alert } from "@mui/material";
import { FormattedMessage } from "react-intl";

import { useApiCall } from "@gemunion/react-hooks";
import { useUser } from "@gemunion/provider-user";
import type { IUser } from "@framework/types";

export const AcceptInvitation: FC = () => {
  const { uuid } = useParams<{ uuid: string }>();

  const user = useUser<IUser>();
  const navigate = useNavigate();

  const { fn } = useApiCall(
    api => {
      return api
        .fetchJson({
          url: `/invitations/accept/${uuid}`,
        })
        .then(() => {
          return user.getProfile();
        })
        .then(() => {
          navigate("/dashboard");
        });
    },
    { success: false },
  );

  useEffect(() => {
    void fn();
  }, []);

  return (
    <Alert severity="warning" sx={{ mt: 2 }}>
      <FormattedMessage id="alert.redirect" />
    </Alert>
  );
};
