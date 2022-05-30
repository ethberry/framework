import { FC, useState } from "react";
import { FormattedMessage } from "react-intl";

import { ConfirmationDialog } from "@gemunion/mui-dialog-confirmation";
import { ProgressOverlay } from "@gemunion/mui-page-layout";

export interface IDeleteDialogProps {
  open: boolean;
  onCancel: () => void;
  onConfirm: (item: any) => Promise<void>;
  getTitle?: (item: any) => string;
  initialValues: any;
}

export const DeleteDialog: FC<IDeleteDialogProps> = props => {
  const { initialValues, onConfirm, getTitle, ...rest } = props;

  const [isLoading, setIsLoading] = useState(false);

  const handleConfirm = async (): Promise<void> => {
    setIsLoading(true);
    await onConfirm(initialValues);
    setIsLoading(false);
  };

  return (
    <ConfirmationDialog maxWidth="xs" onConfirm={handleConfirm} data-testid="DialogDelete" {...rest}>
      <ProgressOverlay isLoading={isLoading}>
        <FormattedMessage
          id="dialogs.delete"
          values={{
            title: getTitle ? getTitle(initialValues) : initialValues.title,
          }}
        />
      </ProgressOverlay>
    </ConfirmationDialog>
  );
};
