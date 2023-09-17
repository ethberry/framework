import { FC, Fragment, useState } from "react";
import { CloudUploadOutlined } from "@mui/icons-material";

import { ListAction, ListActionVariant } from "@framework/mui-lists";
import type { IWaitListList } from "@framework/types";
import { useApiCall } from "@gemunion/react-hooks";

import { WaitListUploadDialog } from "./dialog";
import { IWaitListUploadDto } from "./dialog/file-input";

export interface IWaitListListUploadMenuItemProps {
  waitListList: IWaitListList;
  disabled?: boolean;
  variant?: ListActionVariant;
  onRefreshPage: () => Promise<void>;
}

export const WaitListListUploadMenuItem: FC<IWaitListListUploadMenuItemProps> = props => {
  const {
    waitListList: { id },
    disabled,
    variant,
    onRefreshPage,
  } = props;

  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);

  const { fn, isLoading } = useApiCall((api, values: IWaitListUploadDto) => {
    const { items, listId } = values;
    return api.fetchJson({
      url: "/wait-list/list/upload",
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
        icon={CloudUploadOutlined}
        message="form.buttons.upload"
        disabled={disabled}
        variant={variant}
      />
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
