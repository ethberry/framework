import { FC, Fragment, useState } from "react";
import { Button } from "@mui/material";
import { Add } from "@mui/icons-material";
import { FormattedMessage } from "react-intl";

import { useApiCall } from "@gemunion/react-hooks";
import type { IClaimUploadDto } from "@framework/types";

import { VestingClaimUploadDialog } from "./dialog";

export interface IVestingClaimUploadButtonProps {
  className?: string;
  onRefreshPage: () => Promise<void>;
}

export const VestingClaimUploadButton: FC<IVestingClaimUploadButtonProps> = props => {
  const { className, onRefreshPage } = props;

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
    return fn(form, values).then(async () => {
      await onRefreshPage();
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
        data-testid="VestingClaimUploadButton"
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
