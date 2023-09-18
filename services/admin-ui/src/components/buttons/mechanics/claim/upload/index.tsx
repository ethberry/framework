import { FC, Fragment, useState } from "react";
import { Add } from "@mui/icons-material";
import { useIntl } from "react-intl";
import { enqueueSnackbar } from "notistack";

import { useApiCall } from "@gemunion/react-hooks";
import { ListAction, ListActionVariant } from "@framework/mui-lists";
import type { IClaim, IClaimUploadDto } from "@framework/types";

import { ClaimUploadDialog } from "./dialog";

export interface IClaimUploadButtonProps {
  disabled?: boolean;
  onRefreshPage: () => Promise<void>;
  variant?: ListActionVariant;
}

export const ClaimUploadButton: FC<IClaimUploadButtonProps> = props => {
  const { disabled, onRefreshPage, variant = ListActionVariant.button } = props;

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
      <ListAction
        onClick={handleUpload}
        icon={Add}
        message="form.buttons.upload"
        dataTestId="ClaimUploadButton"
        disabled={disabled}
        variant={variant}
      />
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
