import { FC, Fragment, useState } from "react";
import { Button } from "@mui/material";
import { Add } from "@mui/icons-material";
import { FormattedMessage } from "react-intl";

import { useApiCall } from "@gemunion/react-hooks";
import { IInvitationCreateDto } from "@framework/types";

import { InviteDialog } from "./dialog";

export interface IInviteButtonProps {
  className?: string;
}

export const InviteButton: FC<IInviteButtonProps> = props => {
  const { className } = props;

  const [isInviteDialogOpen, setIsInviteDialogOpen] = useState(false);

  const { fn, isLoading } = useApiCall((api, values: IInvitationCreateDto) => {
    return api.fetchJson({
      url: "/invitations",
      data: values,
      method: "POST",
    });
  });

  const handleInvite = () => {
    setIsInviteDialogOpen(true);
  };

  const handleInviteConfirm = async (values: IInvitationCreateDto, form: any) => {
    return fn(form, values).then(() => {
      setIsInviteDialogOpen(false);
    });
  };

  const handleInviteCancel = () => {
    setIsInviteDialogOpen(false);
  };

  return (
    <Fragment>
      <Button
        variant="outlined"
        startIcon={<Add />}
        onClick={handleInvite}
        data-testid="InviteButton"
        className={className}
      >
        <FormattedMessage id="form.buttons.invite" />
      </Button>
      <InviteDialog
        onConfirm={handleInviteConfirm}
        onCancel={handleInviteCancel}
        open={isInviteDialogOpen}
        isLoading={isLoading}
        initialValues={{
          email: "",
        }}
      />
    </Fragment>
  );
};
