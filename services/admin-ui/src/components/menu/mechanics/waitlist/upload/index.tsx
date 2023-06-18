import { FC, Fragment, useState } from "react";
import { FormattedMessage } from "react-intl";
import { ListItemIcon, MenuItem, Typography } from "@mui/material";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";

import type { IWaitListList } from "@framework/types";
import { useApiCall } from "@gemunion/react-hooks";

import { WaitListUploadDialog } from "./dialog";
import { IWaitListUploadDto } from "./dialog/file-input";

export interface IMintMenuItemProps {
  waitListList: IWaitListList;
}

export const UploadMenuItem: FC<IMintMenuItemProps> = props => {
  const {
    waitListList: { id },
  } = props;

  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);

  const { fn, isLoading } = useApiCall((api, values: IWaitListUploadDto) => {
    const { items, listId } = values;
    return api.fetchJson({
      url: "/waitlist/list/upload",
      data: {
        listId,
        items: items.map(({ id: _id, ...rest }) => rest),
      },
      method: "POST",
    });
  });

  const handleUpload = () => {
    setIsUploadDialogOpen(true);
  };

  const handleUploadConfirm = async (values: IWaitListUploadDto, form: any) => {
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
      <MenuItem onClick={handleUpload}>
        <ListItemIcon>
          <AddCircleOutlineIcon />
        </ListItemIcon>
        <Typography variant="inherit">
          <FormattedMessage id="form.buttons.upload" />
        </Typography>
      </MenuItem>
      <WaitListUploadDialog
        onCancel={handleUploadCancel}
        onConfirm={handleUploadConfirm}
        open={isUploadDialogOpen}
        isLoading={isLoading}
        initialValues={{
          items: [],
          listId: id,
        }}
      />
    </Fragment>
  );
};
