import { FC, Fragment, useState } from "react";
import { Button } from "@mui/material";
import { Add } from "@mui/icons-material";
import { FormattedMessage } from "react-intl";

import { useApiCall } from "@gemunion/react-hooks";

import { VestingClaimUploadDialog } from "./dialog";
import type { IClaimUploadDto } from "./dialog/file-input";

export interface IClaimUploadButtonProps {
  className?: string;
}

export const VestingClaimUploadButton: FC<IClaimUploadButtonProps> = props => {
  const { className } = props;

  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);

  const { fn, isLoading } = useApiCall((api, values: IClaimUploadDto) => {
    const { claims } = values;
    return api.fetchJson({
      url: "/vesting/claims/upload",
      data: {
        claims: claims.map(({ id: _id, ...rest }) => rest),
      },
      method: "POST",
    });
  });

  const handleUpload = () => {
    setIsUploadDialogOpen(true);
  };

  const handleUploadConfirm = async (values: IClaimUploadDto, form: any) => {
    return fn(form, values).then(() => {
      // TODO refresh page
      setIsUploadDialogOpen(false);
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
      <VestingClaimUploadDialog
        onConfirm={handleUploadConfirm}
        onCancel={handleUploadCancel}
        open={isUploadDialogOpen}
        isLoading={isLoading}
        initialValues={{
          claims: [],
        }}
      />
    </Fragment>
  );
};
