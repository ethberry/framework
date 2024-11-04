import { FC, Fragment, useState } from "react";
import { Add } from "@mui/icons-material";
import { useIntl } from "react-intl";
import { enqueueSnackbar } from "notistack";

import { ListAction, ListActionVariant } from "@framework/styled";
import type { IClaim, IClaimTemplateUploadDto } from "@framework/types";
import { useApiCall } from "@ethberry/react-hooks";

import { ClaimTemplateUploadDialog } from "./dialog";

export interface IClaimTemplateUploadButtonProps {
  className?: string;
  disabled?: boolean;
  onRefreshPage: () => Promise<void>;
  variant?: ListActionVariant;
}

export const ClaimTemplateUploadButton: FC<IClaimTemplateUploadButtonProps> = props => {
  const { className, disabled, onRefreshPage, variant = ListActionVariant.button } = props;

  const { formatMessage } = useIntl();

  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);

  const { fn, isLoading } = useApiCall(
    (api, values: IClaimTemplateUploadDto) => {
      const { claims } = values;
      return api
        .fetchJson({
          url: "/claims/templates/upload",
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

  const handleUploadConfirm = async (values: IClaimTemplateUploadDto, form: any) => {
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
      <ClaimTemplateUploadDialog
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