import { FC, Fragment, useState } from "react";
import { Button } from "@mui/material";
import { Add } from "@mui/icons-material";
import { FormattedMessage } from "react-intl";

import { useApiCall } from "@gemunion/react-hooks";

import { ClaimUploadDialog, IClaimUploadDto } from "./dialog";
import { getFormData } from "./utils";

export interface IClaimUploadButtonProps {
  className?: string;
}

export const ClaimUploadButton: FC<IClaimUploadButtonProps> = props => {
  const { className } = props;

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
    await fn(form, values).catch(e => {
      console.error(e); // should be ApiError but it is [Object object]
    });
    setIsUploadDialogOpen(false);
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
