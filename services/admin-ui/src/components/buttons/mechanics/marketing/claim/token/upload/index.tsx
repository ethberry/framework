import { FC, Fragment, useState } from "react";
import { Add } from "@mui/icons-material";
import { useIntl } from "react-intl";
import { enqueueSnackbar } from "notistack";

import { ListAction, ListActionVariant } from "@framework/styled";
import type { IClaim, IClaimTokenUploadDto } from "@framework/types";
import { useApiCall } from "@ethberry/react-hooks";

import { ClaimTokenUploadDialog } from "./dialog";

export interface IClaimTokenUploadButtonProps {
  className?: string;
  disabled?: boolean;
  onRefreshPage: () => Promise<void>;
  variant?: ListActionVariant;
}

export const ClaimTokenUploadButton: FC<IClaimTokenUploadButtonProps> = props => {
  const { className, disabled, onRefreshPage, variant = ListActionVariant.button } = props;

  const { formatMessage } = useIntl();

  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);

  const { fn, isLoading } = useApiCall(
    (api, values: IClaimTokenUploadDto) => {
      const { claims } = values;
      return api
        .fetchJson({
          url: "/claims/tokens/upload",
          data: {
            claims: claims.map(({ id: _id, ...rest }) => rest),
          },
          method: "POST",
        })
        .then((json: IClaim[]) => {
          if (!json?.length || json[0] === null) {
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

  const handleUploadConfirm = async (values: IClaimTokenUploadDto, form: any) => {
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
        className={className}
        dataTestId="ClaimUploadButton"
        disabled={disabled}
        variant={variant}
      />
      <ClaimTokenUploadDialog
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
