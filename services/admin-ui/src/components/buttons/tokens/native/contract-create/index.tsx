import { FC, Fragment, useState } from "react";
import { Button } from "@mui/material";
import { Add } from "@mui/icons-material";
import { FormattedMessage } from "react-intl";

import { useApiCall } from "@gemunion/react-hooks";

import { NativeContractCreateDialog } from "./create-dialog";

export interface INativeContractCreateButtonProps {
  className?: string;
  onUpdate: () => Promise<void>;
}

export const NativeContractCreateButton: FC<INativeContractCreateButtonProps> = props => {
  const { className, onUpdate } = props;

  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  const { fn } = useApiCall((api, values) => {
    return api.fetchJson({
      url: "/native-contracts",
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
        data-testid="NativeTokenCreateButton"
        className={className}
      >
        <FormattedMessage id="form.buttons.create" />
      </Button>
      <NativeContractCreateDialog
        onConfirm={handleCreateConfirm}
        onCancel={handleCreateCancel}
        open={isCreateDialogOpen}
      />
    </Fragment>
  );
};
