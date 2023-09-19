import { FC, Fragment, useState } from "react";
import { Add } from "@mui/icons-material";

import { useApiCall } from "@gemunion/react-hooks";
import { ListAction, ListActionVariant } from "@framework/mui-lists";
import type { IClaimUploadDto } from "@framework/types";

import { VestingClaimUploadDialog } from "./dialog";

export interface IVestingClaimUploadButtonProps {
  className?: string;
  disabled?: boolean;
  onRefreshPage: () => Promise<void>;
  variant?: ListActionVariant;
}

export const VestingClaimUploadButton: FC<IVestingClaimUploadButtonProps> = props => {
  const { className, disabled, onRefreshPage, variant = ListActionVariant.button } = props;

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
      <ListAction
        onClick={handleUpload}
        icon={Add}
        message="form.buttons.upload"
        className={className}
        dataTestId="VestingClaimUploadButton"
        disabled={disabled}
        variant={variant}
      />
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
