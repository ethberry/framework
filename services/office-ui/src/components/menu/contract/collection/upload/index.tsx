import { FC, Fragment, useState } from "react";
import { ListItemIcon, MenuItem, Typography } from "@mui/material";
import { PaidOutlined } from "@mui/icons-material";

import { FormattedMessage, useIntl } from "react-intl";
import { useSnackbar } from "notistack";

import { useApiCall } from "@gemunion/react-hooks";
import { ApiError } from "@gemunion/provider-api-firebase";
import { IContract } from "@framework/types";

import { CollectionUploadDialog, ICollectionUploadDto } from "./dialog";
import { getFormData } from "./utils";

export interface ICollectionUploadMenuItemProps {
  contract: IContract;
}

export const CollectionUploadMenuItem: FC<ICollectionUploadMenuItemProps> = props => {
  const {
    contract: { address },
  } = props;

  const { formatMessage } = useIntl();
  const { enqueueSnackbar } = useSnackbar();

  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);

  const { fn } = useApiCall(
    (api, { files }: ICollectionUploadDto) => {
      return api.fetchJson({
        url: `/collections/contracts/${address}/upload`,
        data: getFormData({ file: files[0] }),
        method: "POST",
      });
    },
    { error: false },
  );

  const handleUpload = () => {
    setIsUploadDialogOpen(true);
  };

  const handleUploadConfirm = async (values: ICollectionUploadDto, form: any) => {
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
      <MenuItem onClick={handleUpload}>
        <ListItemIcon>
          <PaidOutlined fontSize="small" />
        </ListItemIcon>
        <Typography variant="inherit">
          <FormattedMessage id="form.buttons.collectionUpload" />
        </Typography>
      </MenuItem>
      <CollectionUploadDialog
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
