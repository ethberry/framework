import { FC, Fragment, useState } from "react";
import { Button } from "@mui/material";
import { Add } from "@mui/icons-material";
import { FormattedMessage, useIntl } from "react-intl";
import { enqueueSnackbar } from "notistack";

import { useApiCall } from "@gemunion/react-hooks";
import type { IClaim, IClaimUploadDto } from "@framework/types";

import { ClaimUploadDialog } from "./dialog";

export interface IClaimUploadButtonProps {
  className?: string;
  onRefreshPage: () => Promise<void>;
}

export const ClaimUploadButton: FC<IClaimUploadButtonProps> = props => {
  const { className, onRefreshPage } = props;

  const { formatMessage } = useIntl();

  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);

  const { fn, isLoading } = useApiCall(
    (api, values: IClaimUploadDto) => {
      const { claims } = values;
      return api
        .fetchJson({
          url: "/claims/upload",
          data: {
            claims: claims.map(({ id: _id, ...rest }) => rest),
          },
          method: "POST",
        })
        .then((json: IClaim[]) => {
          if (json?.length) {
            enqueueSnackbar(formatMessage({ id: "snackbar.claimsNotUploaded" }), { variant: "error" });
          } else {
            enqueueSnackbar(
              formatMessage({ id: "snackbar.claimsUploaded" }, { amount: json.length, total: claims.length }),
              { variant: "success" },
            );
          }
        });
    },
    { success: false },
  );

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
        data-testid="ClaimUploadButton"
        className={className}
      >
        <FormattedMessage id="form.buttons.upload" />
      </Button>
      <ClaimUploadDialog
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
