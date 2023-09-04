import { FC, Fragment, useState } from "react";
import { FormattedMessage } from "react-intl";
import { ListItemIcon, MenuItem, Typography } from "@mui/material";
import { Add } from "@mui/icons-material";

import { useApiCall } from "@gemunion/react-hooks";
import type { IWaitListItem, IWaitListItemCreateDto, IWaitListList } from "@framework/types";

import { WaitListItemEditDialog } from "../../../../../pages/mechanics/wait-list/item/edit";

export interface IMintMenuItemProps {
  waitListList: IWaitListList;
}

export const CreateMenuItem: FC<IMintMenuItemProps> = props => {
  const {
    waitListList: { id },
  } = props;

  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  const { fn } = useApiCall((api, values: IWaitListItemCreateDto) => {
    const { account, listId } = values;
    return api.fetchJson({
      url: "/wait-list/item",
      data: { account, listId },
      method: "POST",
    });
  });

  const handleUpload = () => {
    setIsCreateDialogOpen(true);
  };

  const handleCreateConfirm = async (values: Partial<IWaitListItem>, form: any) => {
    return fn(form, values).then(() => {
      // TODO refresh page
      setIsCreateDialogOpen(false);
    });
  };

  const handleCreateCancel = () => {
    setIsCreateDialogOpen(false);
  };

  return (
    <Fragment>
      <MenuItem onClick={handleUpload}>
        <ListItemIcon>
          <Add />
        </ListItemIcon>
        <Typography variant="inherit">
          <FormattedMessage id="form.buttons.add" />
        </Typography>
      </MenuItem>
      <WaitListItemEditDialog
        onCancel={handleCreateCancel}
        onConfirm={handleCreateConfirm}
        open={isCreateDialogOpen}
        testId="WaitListEditDialog"
        initialValues={{
          account: "",
          listId: id,
        }}
      />
    </Fragment>
  );
};
