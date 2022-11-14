import { FC, Fragment, useState } from "react";
import { Button } from "@mui/material";
import { Add } from "@mui/icons-material";
import { FormattedMessage, useIntl } from "react-intl";
import { useSnackbar } from "notistack";

import { useApiCall } from "@gemunion/react-hooks";

import { ClaimUploadDialog, IClaimUploadDto } from "./dialog";
import { getFormData } from "./utils";
import { ApiError } from "@gemunion/provider-api-firebase";

export interface IClaimUploadButtonProps {
  className?: string;
}

export const ClaimUploadButton: FC<IClaimUploadButtonProps> = props => {
  const { className } = props;

  const { formatMessage } = useIntl();
  const { enqueueSnackbar } = useSnackbar();

  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);

  const { fn } = useApiCall(
    (api, { files }: IClaimUploadDto) => {
      return api.fetchJson({
        url: "/claims/upload",
        data: getFormData({ file: files[0] }),
        method: "POST",
      });
    },
    { error: false },
  );

  const handleUpload = () => {
    setIsUploadDialogOpen(true);
  };

  const handleUploadConfirm = async (values: IClaimUploadDto, form: any) => {
    const name = "files";

    form.resetField(name);

    await fn(form, values)
      .then(result => {
        if (!result) {
          return;
        }
        setIsUploadDialogOpen(false);
      })
      .catch((e: ApiError) => {
        if (e.status === 400) {
          const errors = e.getLocalizedValidationErrors();

          enqueueSnackbar(formatMessage({ id: "form.validations.badInput" }, { label: name }), { variant: "error" });

          Object.keys(errors).forEach(key => {
            form?.setError(name, { type: "custom", message: errors[key] });
          });
        } else if (e.status) {
          enqueueSnackbar(formatMessage({ id: `snackbar.${e.message}` }), { variant: "error" });
        } else {
          console.error(e);
          enqueueSnackbar(formatMessage({ id: "snackbar.error" }), { variant: "error" });
        }
      });
  };

  const handleUploadCancel = () => {
    setIsUploadDialogOpen(false);
  };

  return (
    <Fragment>
      <Button
        variant="outlined"
        startIcon={<Add />}
        onClick={handleUpload}
        data-testid="ClaimUploadButton"
        className={className}
      >
        <FormattedMessage id="form.buttons.upload" />
      </Button>
      <ClaimUploadDialog
        onConfirm={handleUploadConfirm}
        onCancel={handleUploadCancel}
        open={isUploadDialogOpen}
        initialValues={{
          files: [],
        }}
      />
    </Fragment>
  );
};
