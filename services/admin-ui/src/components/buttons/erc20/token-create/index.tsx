import { FC, Fragment, useState } from "react";
import { Button } from "@mui/material";
import { Add } from "@mui/icons-material";
import { FormattedMessage } from "react-intl";

import { useApiCall } from "@gemunion/react-hooks";

import { Erc20TokenCreateDialog } from "./create-dialog";

export interface IErc20TokenCreateButtonProps {
  className?: string;
  onUpdate: () => Promise<void>;
}

export const Erc20TokenCreateButton: FC<IErc20TokenCreateButtonProps> = props => {
  const { className, onUpdate } = props;

  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  const { fn } = useApiCall(async (api, values) => {
    return api.fetchJson({
      url: "/erc20-tokens",
      method: "POST",
      data: values,
    });
  });

  const handleCreate = () => {
    setIsCreateDialogOpen(true);
  };

  const handleCreateConfirm = async (values: Partial<any>, form: any) => {
    return fn(form, values).then(() => {
      setIsCreateDialogOpen(false);
      return onUpdate();
    });
  };

  const handleCreateCancel = () => {
    setIsCreateDialogOpen(false);
  };

  return (
    <Fragment>
      <Button
        variant="outlined"
        startIcon={<Add />}
        onClick={handleCreate}
        data-testid="Erc20TokenCreateButton"
        className={className}
      >
        <FormattedMessage id="form.buttons.create" />
      </Button>
      <Erc20TokenCreateDialog onConfirm={handleCreateConfirm} onCancel={handleCreateCancel} open={isCreateDialogOpen} />
    </Fragment>
  );
};
